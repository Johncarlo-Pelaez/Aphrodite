import {
  Injectable,
  ConflictException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';
import { DatesUtil, FilenameUtil } from 'src/utils';
import { FileStorageService } from 'src/file-storage-service';
import { DocumentRepository, UserRepository } from 'src/repositories';
import { EncodeValues } from 'src/repositories/document';
import { DocumentProducer } from 'src/producers';
import { CreatedResponse } from 'src/core';
import { Document, DocumentStatus, Role } from 'src/entities';
import { MailService } from 'src/mail/';
import {
  UploadDocument,
  ReplaceDocumentFile,
  EncodeDocDetails,
  EncodeDocQRBarCode,
  CheckerApproveDoc,
  CheckerDisApproveDoc,
  DocumentApprover,
  RetryDocuments,
  CancelDocuments,
  DeleteDocuments,
} from './document.params';
const { readFile } = fs.promises;

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly documentRepository: DocumentRepository,
    private readonly documentProducer: DocumentProducer,
    private readonly datesUtil: DatesUtil,
    private readonly filenameUtil: FilenameUtil,
    private readonly mailService: MailService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async uploadDocument(data: UploadDocument): Promise<CreatedResponse> {
    const dateRightNow = this.datesUtil.getDateNow();
    const { buffer, size, mimetype, originalname } = data.file;
    const uuid = uuidv4();
    const fileFullPath = uuid.toUpperCase();
    const filename = this.filenameUtil
      .getFilenameWithoutExtension(originalname)
      .replace(/\.$/, '');
    let qrCode: string;

    if (filename.match(/^ecr/i) || filename.match(/^ecp/i)) {
      qrCode = filename;
    }

    if (filename.match(/_/g)) {
      qrCode = filename.replace(/_/g, '|');
    }

    if (filename.length === 18) {
      qrCode = filename.substr(0, 15);
    }

    const dupDoc = await this.documentRepository.getDocumentByQRCode(qrCode);

    if (
      qrCode &&
      !!dupDoc &&
      (!dupDoc?.isFileDeleted || dupDoc?.status === DocumentStatus.MIGRATE_DONE)
    )
      throw new ConflictException('QR code or Barcode already exist.');

    await this.fileStorageService.createFile(fileFullPath, buffer);

    const pdfData = await pdfParse(buffer);
    let document = new Document();

    document = await this.documentRepository.createDocument({
      uuid,
      documentName: originalname,
      documentSize: size,
      mimeType: mimetype,
      qrCode: qrCode,
      createdDate: dateRightNow,
      username: data.uploadedBy,
      pageTotal: pdfData?.numpages,
    });

    await this.documentProducer.migrate(document);

    return document;
  }

  async replaceDocumentFile(data: ReplaceDocumentFile): Promise<void> {
    const currentDocument = await this.documentRepository.getDocument(
      data.documentId,
    );

    if (!currentDocument) throw new NotFoundException();

    const { buffer, size, mimetype, originalname } = data.file;
    const fileFullPath = currentDocument.uuid;
    const filename = this.filenameUtil
      .getFilenameWithoutExtension(originalname)
      .replace(/\.$/, '');
    let qrCode: string;

    if (filename.match(/^ecr/i) || filename.match(/^ecp/i)) {
      qrCode = filename;
    }

    if (filename.match(/_/g)) {
      qrCode = filename.replace(/_/g, '|');
    }

    if (filename.length >= 18) {
      qrCode = filename.substr(0, 15);
    }

    const dupDoc = await this.documentRepository.getDocumentByQRCode(
      qrCode,
      currentDocument.id,
    );

    if (
      qrCode &&
      !!dupDoc &&
      (!dupDoc?.isFileDeleted || dupDoc?.status === DocumentStatus.MIGRATE_DONE)
    )
      throw new ConflictException('QR code or Barcode already exist.');

    if (await this.fileStorageService.checkIfFileExist(fileFullPath)) {
      await this.fileStorageService.deleteFile(fileFullPath);
    }

    try {
      await this.fileStorageService.createFile(fileFullPath, buffer);
    } catch (err) {
      throw err;
    }

    const pdfData = await pdfParse(buffer);
    let document = new Document();

    document = await this.documentRepository.replaceFile({
      documentId: currentDocument.id,
      documentName: originalname,
      documentSize: size,
      mimeType: mimetype,
      pageTotal: pdfData?.numpages,
      qrCode: qrCode,
      replacedAt: this.datesUtil.getDateNow(),
      replacedBy: data.replacedBy,
    });

    await this.documentProducer.migrate(document);
  }

  async getDocumentFile(documentId: number): Promise<[Document, Buffer]> {
    const document = await this.documentRepository.getDocument(documentId);
    const fileFullPath = document.uuid;
    let buffer: Buffer;

    try {
      buffer = await this.fileStorageService.getFile(fileFullPath);
    } catch (err) {
      if (err instanceof NotFoundException) {
        buffer = await readFile('./public/deleted-file.pdf');
      } else throw err;
    }

    return [document, buffer];
  }

  async encodeDocDetails(data: EncodeDocDetails): Promise<void> {
    const {
      documentId,
      companyCode,
      contractNumber,
      nomenclature,
      documentGroup,
      encodedBy,
    } = data;

    const encodeValues: EncodeValues = {
      companyCode,
      contractNumber,
      nomenclature,
      documentGroup,
    };

    const dateRightNow = this.datesUtil.getDateNow();
    let document = new Document();

    document = await this.documentRepository.encodeAccountDetails({
      documentId,
      encodeValues: JSON.stringify(encodeValues),
      encodedAt: dateRightNow,
      encodedBy,
    });
    await this.documentProducer.migrate(document);
  }

  async encodeDocQRBarcode(data: EncodeDocQRBarCode): Promise<void> {
    const { documentId, qrBarCode, encodedBy } = data;
    let document = new Document();
    document = await this.documentRepository.encodeQrBarcode({
      documentId,
      qrBarCode,
      encodedAt: this.datesUtil.getDateNow(),
      encodedBy,
    });
    await this.documentProducer.migrate(document);
  }

  async checkerApproveDoc(data: CheckerApproveDoc): Promise<void> {
    const { documentId, documentDate, remarks, checkedBy } = data;
    let document = new Document();
    document = await this.documentRepository.checkerApproveDoc({
      documentId,
      documentDate,
      remarks,
      checkedBy,
      checkedAt: this.datesUtil.getDateNow(),
    });
    await this.documentProducer.migrate(document);
  }

  async checkerDisapproveDoc(data: CheckerDisApproveDoc): Promise<void> {
    const { documentId, documentDate, remarks, checkedBy } = data;
    await this.documentRepository.checkerDisapproveDoc({
      documentId,
      documentDate,
      remarks,
      checkedBy,
      checkedAt: this.datesUtil.getDateNow(),
    });
  }

  async approverApproveDoc(data: DocumentApprover): Promise<void> {
    const { documentId, approver } = data;
    let document = new Document();
    document = await this.documentRepository.approverApproveDoc({
      documentId,
      approver,
      modifiedAt: this.datesUtil.getDateNow(),
    });
    await this.documentProducer.migrate(document);
  }

  async approverDisapproveDoc(data: DocumentApprover): Promise<void> {
    const { documentId, approver } = data;
    await this.documentRepository.approverDispproveDoc({
      documentId,
      approver,
      modifiedAt: this.datesUtil.getDateNow(),
    });
  }

  async retryDocuments(data: RetryDocuments): Promise<void> {
    let document = new Document();
    for await (const documentId of data.documentIds) {
      document = await this.documentRepository.updateForRetry({
        documentId,
        processAt: this.datesUtil.getDateNow(),
        retriedBy: data.retriedBy,
      });
      await this.documentProducer.migrate(document);
    }
  }

  async cancelDocuments (data: CancelDocuments): Promise<void> {
    await this.documentProducer.cancel(data.documentIds);
    for await (const documentId of data.documentIds) {
      try {
        await this.documentRepository.updateToCancelled({
          documentId,
          processAt: this.datesUtil.getDateNow(),
          cancelledBy: data.cancelledBy,
        });
      } catch (err) {
        this.logger.error(err);
        throw err;
      }
    }
  }

  async retryErrorDocuments(retriedBy: string): Promise<void> {
    const documentIds = (
      await this.documentRepository.getDocuments({
        statuses: Object.values(DocumentStatus).filter(
          (s) => s.includes('FAILED') || s.includes('CANCELLED'),
        ),
        username: retriedBy,
      })
    ).map((doc) => doc.id);
    await this.retryDocuments({ documentIds, retriedBy });
  }

  async cancelWaitingDocumentsInQueue(cancelledBy: string): Promise<void> {
    const documentIds = (
      await this.documentRepository.getDocuments({
        statuses: [
          DocumentStatus.UPLOADED,
          DocumentStatus.ENCODING,
          DocumentStatus.CHECKING,
          DocumentStatus.RETRYING,
          DocumentStatus.APPROVED,
          DocumentStatus.CHECKING_APPROVED,
        ],
        username: cancelledBy,
      })
    ).map((doc) => doc.id);
    await this.cancelDocuments({ documentIds, cancelledBy });
  }

  async deleteDocuments(data: DeleteDocuments): Promise<void> {
    for await (const documentId of data.documentIds) {
      const document = await this.documentRepository.getDocument(documentId);
      if (!document) throw new NotFoundException();
      if (!document.isFileDeleted) {
        const fileFullPath = document.uuid;
        await this.fileStorageService.deleteFile(fileFullPath);
        await this.documentRepository.deleteFile({
          documentId,
          deletedBy: data.deletedBy,
          deletedAt: this.datesUtil.getDateNow(),
        });
      }
    }
  }
}
