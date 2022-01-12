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
import { AppConfigService } from 'src/app-config';
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
const { readFile, writeFile, unlink, stat } = fs.promises;

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly documentRepository: DocumentRepository,
    private readonly documentProducer: DocumentProducer,
    private readonly datesUtil: DatesUtil,
    private readonly filenameUtil: FilenameUtil,
    private readonly appConfigService: AppConfigService,
    private readonly mailService: MailService,
  ) {}

  private async checkIfFileExist(fileFullPath: string): Promise<boolean> {
    try {
      await stat(fileFullPath);
      return true;
    } catch (err) {
      if (err?.code === 'ENOENT') {
        return false;
      }
    }
  }

  async uploadDocument(data: UploadDocument): Promise<CreatedResponse> {
    const dateRightNow = this.datesUtil.getDateNow();
    const { buffer, size, mimetype, originalname } = data.file;
    const uuid = uuidv4();
    const fileFullPath = this.filenameUtil.buildFullPath(
      this.appConfigService.filePath,
      uuid.toUpperCase(),
    );
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

    const dupDoc = await this.documentRepository.getDocumentByQRCode(qrCode);

    if (
      qrCode &&
      (!dupDoc?.isFileDeleted || dupDoc?.status === DocumentStatus.MIGRATE_DONE)
    )
      throw new ConflictException();

    await writeFile(fileFullPath, buffer);

    const pdfData = await pdfParse(buffer);
    const response = new CreatedResponse();

    response.id = await this.documentRepository.createDocument({
      uuid,
      documentName: originalname,
      documentSize: size,
      mimeType: mimetype,
      qrCode: qrCode,
      createdDate: dateRightNow,
      username: data.uploadedBy,
      pageTotal: pdfData?.numpages,
    });

    await this.documentProducer.migrate(response.id);

    return response;
  }

  async replaceDocumentFile(data: ReplaceDocumentFile): Promise<void> {
    const currentDocument = await this.documentRepository.getDocument(
      data.documentId,
    );
    if (!currentDocument) throw new NotFoundException();

    const { buffer, size, mimetype, originalname } = data.file;

    const fileFullPath = this.filenameUtil.buildFullPath(
      this.appConfigService.filePath,
      currentDocument.uuid,
    );
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
      (!dupDoc?.isFileDeleted || dupDoc?.status === DocumentStatus.MIGRATE_DONE)
    )
      throw new ConflictException();

    if (await this.checkIfFileExist(fileFullPath)) {
      await unlink(fileFullPath);
    }

    try {
      await writeFile(fileFullPath, buffer);
    } catch (err) {
      throw err;
    }

    const pdfData = await pdfParse(buffer);

    await this.documentRepository.replaceFile({
      documentId: currentDocument.id,
      documentName: originalname,
      documentSize: size,
      mimeType: mimetype,
      pageTotal: pdfData?.numpages,
      qrCode: qrCode,
      replacedAt: this.datesUtil.getDateNow(),
      replacedBy: data.replacedBy,
    });

    await this.documentProducer.migrate(currentDocument.id);
  }

  async getDocumentFile(documentId: number): Promise<[Document, Buffer]> {
    const document = await this.documentRepository.getDocument(documentId);
    const fileFullPath = this.filenameUtil.buildFullPath(
      this.appConfigService.filePath,
      document.uuid,
    );
    let buffer: Buffer;
    try {
      buffer = await readFile(fileFullPath);
    } catch (error) {
      if (error?.code === 'ENOENT') {
        buffer = await readFile('./public/deleted-file.pdf');
      } else {
        throw error;
      }
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
    await this.documentRepository.encodeAccountDetails({
      documentId,
      encodeValues: JSON.stringify(encodeValues),
      encodedAt: dateRightNow,
      encodedBy,
    });
    await this.documentProducer.migrate(documentId);
  }

  async encodeDocQRBarcode(data: EncodeDocQRBarCode): Promise<void> {
    const { documentId, qrBarCode, encodedBy } = data;
    await this.documentRepository.encodeQrBarcode({
      documentId,
      qrBarCode,
      encodedAt: this.datesUtil.getDateNow(),
      encodedBy,
    });
    await this.documentProducer.migrate(documentId);
  }

  async checkerApproveDoc(data: CheckerApproveDoc): Promise<void> {
    const { documentId, documentDate, checkedBy } = data;
    await this.documentRepository.checkerApproveDoc({
      documentId,
      documentDate,
      checkedBy,
      checkedAt: this.datesUtil.getDateNow(),
    });
    await this.documentProducer.migrate(documentId);
  }

  async checkerDisapproveDoc(data: CheckerDisApproveDoc): Promise<void> {
    const { documentId, documentDate, checkedBy, remarks } = data;
    await this.documentRepository.checkerDisapproveDoc({
      documentId,
      documentDate,
      remarks,
      checkedBy,
      checkedAt: this.datesUtil.getDateNow(),
    });

    const totalDocsForReview = await this.documentRepository.count({
      statuses: [DocumentStatus.CHECKING_DISAPPROVED],
    });

    for (const user of await this.userRepository.getUsers({
      roles: [Role.REVIEWER],
    })) {
      this.mailService.sendReviewerNotification({
        email: user.username,
        name: `${user.firstName} ${user.lastName}`,
        documentsNumber: totalDocsForReview,
      });
    }
  }

  async approverApproveDoc(data: DocumentApprover): Promise<void> {
    const { documentId, approver } = data;
    await this.documentRepository.approverApproveDoc({
      documentId,
      approver,
      modifiedAt: this.datesUtil.getDateNow(),
    });
    await this.documentProducer.migrate(documentId);
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
    for await (const documentId of data.documentIds) {
      await this.documentRepository.updateForRetry({
        documentId,
        processAt: this.datesUtil.getDateNow(),
        retriedBy: data.retriedBy,
      });
      await this.documentProducer.migrate(documentId);
    }
  }

  async cancelDocuments(data: CancelDocuments): Promise<void> {
    for await (const documentId of data.documentIds) {
      try {
        await this.documentProducer.cancel(documentId);
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
      })
    ).map((doc) => doc.id);
    await this.cancelDocuments({ documentIds, cancelledBy });
  }

  async deleteDocuments(data: DeleteDocuments): Promise<void> {
    for await (const documentId of data.documentIds) {
      const document = await this.documentRepository.getDocument(documentId);
      if (!document) throw new NotFoundException();

      const fileFullPath = this.filenameUtil.buildFullPath(
        this.appConfigService.filePath,
        document.uuid,
      );

      try {
        await unlink(fileFullPath);
      } catch (err) {
        if (err?.code === 'ENOENT') {
          throw new NotFoundException();
        } else {
          throw err;
        }
      }

      await this.documentRepository.deleteFile({
        documentId,
        deletedBy: data.deletedBy,
        deletedAt: this.datesUtil.getDateNow(),
      });
    }
  }
}
