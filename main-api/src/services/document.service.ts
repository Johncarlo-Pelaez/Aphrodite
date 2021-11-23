import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DatesUtil } from 'src/utils';
import { AppConfigService } from 'src/app-config';
import { DocumentRepository } from 'src/repositories';
import { DocumentProducer } from 'src/producers';
import { CreatedResponse } from 'src/core';
import { Document } from 'src/entities';
import {
  SalesForceService,
  GetContractDetailsResult,
  GetDocumentTypeResult,
  DocumentType,
} from 'src/sales-force-service';
import { DocumentStatus } from 'src/entities';
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
    private readonly salesForceService: SalesForceService,
  ) {}

  async uploadDocument(data: UploadDocuments): Promise<CreatedResponse> {
    const dateRightNow = this.datesUtil.getDateNow();
    let file = data.file;
    const uuid = uuidv4();
    let fileName: string = uuid;
    const fullPath = path.join(
      this.appConfigService.filePath,
      fileName.toUpperCase(),
    );

    await writeFile(fullPath, file.buffer);

    const response = new CreatedResponse();
    response.id = await this.documentRepository.createDocument({
      uuid: fileName,
      documentName: file.originalname,
      documentSize: file.size,
      mimeType: file.mimetype,
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

  async encodeDocDetails(data: EncodeDocDetails): Promise<DocumentType> {
    const {
      documentId,
      companyCode,
      contractNumber,
      nomenclature,
      documentGroup,
      encodedBy,
    } = data;
    const document = await this.documentRepository.getDocument(documentId);
    let dateRightNow = this.datesUtil.getDateNow();
    const encodeValues = {
      companyCode,
      contractNumber,
      nomenclature,
      documentGroup,
    };

    const getContractDetailsReqParams = {
      ContractNumber: contractNumber,
      CompanyCode: companyCode,
    };
    let getContractDetailsResult: GetContractDetailsResult;

    try {
      getContractDetailsResult =
        await this.salesForceService.getContractDetails(
          getContractDetailsReqParams,
        );
    } catch (error) {
      dateRightNow = this.datesUtil.getDateNow();
      await this.documentRepository.failEncode({
        documentId,
        contractDetailsReqParams: JSON.stringify(getContractDetailsReqParams),
        failedAt: dateRightNow,
        encodeValues: JSON.stringify(encodeValues),
      });
      throw error;
    }

    let getDocTypeReqResult: GetDocumentTypeResult = JSON.parse(
      document.documentType,
    );

    const contractDetail = !!getContractDetailsResult?.reponse?.items.length
      ? getContractDetailsResult.reponse.items[0]
      : undefined;

    const documentType = {
      Nomenclature: nomenclature,
      DocumentGroup: documentGroup,
      ContractNumber: contractDetail?.ContractNumber,
      CompanyCode: contractDetail?.CompanyCode,
      Brand: contractDetail?.Brand,
      ProjectCode: contractDetail?.ProjectCode,
      TowerPhase: contractDetail?.Tower_Phase,
      CustomerCode: contractDetail?.CustomerCode,
      UnitDetails: contractDetail?.UnitDescription,
      AccountName: contractDetail?.CustomerName,
      ProjectName: contractDetail?.ProjectName,
      Transmittal: '',
      CopyType: '',
    };

    getDocTypeReqResult.response.push(documentType);

    dateRightNow = this.datesUtil.getDateNow();
    await this.documentRepository.encodeAccountDetails({
      documentId,
      documentType: JSON.stringify(getDocTypeReqResult),
      contractDetails: JSON.stringify(getContractDetailsResult),
      contractDetailsReqParams: JSON.stringify(getContractDetailsReqParams),
      encodeValues: JSON.stringify(encodeValues),
      encodedAt: dateRightNow,
      encodedBy,
    });

    await this.documentProducer.migrate(documentId);
    return documentType;
  }

  async encodeDocQRBarcode(data: EncodeDocQRBarCode): Promise<void> {
    const { documentId, qrCode, encodedBy } = data;
    await this.documentRepository.encodeQrBarcode({
      documentId,
      qrBarCode: qrCode,
      encodedAt: this.datesUtil.getDateNow(),
      encodedBy,
      encodeValues: JSON.stringify({ qrBarCode: qrCode }),
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
    for await (const {
      id,
      status,
      qrCode,
      encodeValues: strEncodeValues,
    } of documents) {
      await this.documentRepository.updateForRetry({
        documentId: id,
        processAt: this.datesUtil.getDateNow(),
        retryBy: data.retryBy,
      });

      switch (status) {
        case DocumentStatus.ENCODE_FAILED:
          const encodeValues = strEncodeValues
            ? JSON.parse(strEncodeValues)
            : undefined;
          const qrBarCode = encodeValues?.qrBarCode;
          if (qrBarCode && qrBarCode !== qrCode) {
            await this.encodeDocQRBarcode({
              documentId: id,
              qrCode: qrBarCode,
              encodedBy: data.retryBy,
            });
          } else {
            await this.encodeDocDetails({
              documentId: id,
              encodedBy: data.retryBy,
              ...encodeValues,
            });
          }
          break;
        default:
          break;
      }

      await this.documentProducer.migrate(id);
    }
  }
}
