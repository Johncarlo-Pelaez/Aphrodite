import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DatesUtil } from 'src/utils';
import { AppConfigService } from 'src/app-config';
import { DocumentRepository } from 'src/repositories';
import { EncodeValues } from 'src/repositories/document';
import { DocumentProducer } from 'src/producers';
import { CreatedResponse } from 'src/core';
import { Document } from 'src/entities';
import {
  UploadDocuments,
  EncodeDocDetails,
  EncodeDocQRBarCode,
  CheckerApproveDoc,
  CheckerDisApproveDoc,
  DocumentApprover,
  RetryDocuments,
} from './document.inputs';
const { readFile, writeFile } = fs.promises;

@Injectable()
export class DocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly documentProducer: DocumentProducer,
    private readonly datesUtil: DatesUtil,
    private readonly appConfigService: AppConfigService,
  ) {}

  async uploadDocument(data: UploadDocuments): Promise<CreatedResponse> {
    const dateRightNow = this.datesUtil.getDateNow();
    const { buffer, size, mimetype, originalname } = data.file;
    const uuid = uuidv4();
    const fullPath = path.join(
      this.appConfigService.filePath,
      uuid.toUpperCase(),
    );
    const filename = path
      .basename(originalname, path.extname(originalname))
      .replace(/\.$/, '');
    let qrCode: string;

    if (filename.match(/^ecr/i) || filename.match(/^ecp/i)) {
      qrCode = filename;
    } else if (filename.match(/_/g)) {
      qrCode = filename.replace(/_/g, '|');
    } else if (filename.length === 18) {
      qrCode = filename.substr(0, 15);
    }

    await writeFile(fullPath, buffer);

    const response = new CreatedResponse();
    response.id = await this.documentRepository.createDocument({
      uuid,
      documentName: originalname,
      documentSize: size,
      mimeType: mimetype,
      qrCode: qrCode,
      createdDate: dateRightNow,
      userId: data.uploadedBy,
    });

    await this.documentProducer.migrate(response.id);

    return response;
  }

  async getDocumentFile(documentId: number): Promise<[Document, Buffer]> {
    const document = await this.documentRepository.getDocument(documentId);
    const buffer = await readFile(
      path.join(this.appConfigService.filePath, document.uuid),
    );
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
    const documents = await this.documentRepository.findDocumentsByIds(
      data.documentIds,
    );
    for await (const { id: documentId } of documents) {
      await this.documentRepository.updateForRetry({
        documentId,
        processAt: this.datesUtil.getDateNow(),
        retryBy: data.retryBy,
      });
      await this.documentProducer.migrate(documentId);
    }
  }
}
