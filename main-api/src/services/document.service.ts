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
} from 'src/sales-force-service';
import {
  UploadDocuments,
  EncodeDocument,
  CheckerApproveDoc,
  CheckerDisApproveDoc,
  DocumentApprover,
} from './document.inputs';
const { readFile, writeFile } = fs.promises;

@Injectable()
export class DocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly datesUtil: DatesUtil,
    private readonly appConfigService: AppConfigService,
    private readonly documentProducer: DocumentProducer,
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

  async encodeDocument(data: EncodeDocument): Promise<void> {
    const {
      documentId,
      qrCode,
      companyCode,
      contractNumber,
      nomenClature,
      documentGroup,
      encodedBy,
    } = data;
    const document = await this.documentRepository.getDocument(documentId);
    let dateRightNow = this.datesUtil.getDateNow();

    if (qrCode && qrCode !== '' && qrCode !== document.qrCode) {
      await this.documentRepository.encodeQrBarcode({
        documentId,
        qrBarCode: qrCode,
        encodedAt: dateRightNow,
        encodedBy,
      });
    } else {
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
        await this.documentRepository.failIndexing({
          documentId,
          contractDetailsReqParams: JSON.stringify(getContractDetailsReqParams),
          failedAt: dateRightNow,
        });
        throw error;
      }

      let getDocTypeReqResult: GetDocumentTypeResult = JSON.parse(
        document.documentType,
      );

      const contractDetail = !!getContractDetailsResult?.reponse?.items.length
        ? getContractDetailsResult.reponse.items[0]
        : undefined;

      getDocTypeReqResult.response = [
        {
          Nomenclature: nomenClature,
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
        },
      ];

      dateRightNow = this.datesUtil.getDateNow();
      await this.documentRepository.encodeAccountDetails({
        documentId,
        documentType: JSON.stringify(getDocTypeReqResult),
        contractDetails: JSON.stringify(getContractDetailsResult),
        contractDetailsReqParams: JSON.stringify(getContractDetailsReqParams),
        encodedAt: dateRightNow,
        encodedBy,
      });
    }

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
}
