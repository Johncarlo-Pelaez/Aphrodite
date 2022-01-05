import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as fs from 'fs';
import * as path from 'path';
import { AppConfigService } from 'src/app-config';
import { DatesUtil } from 'src/utils';
import {
  DocumentRepository,
  NomenclatureWhitelistRepository,
} from 'src/repositories';
import { EncodeValues } from 'src/repositories/document';
import { QRService } from 'src/qr-service';
import {
  SalesForceService,
  GetDocumentTypeResult,
  GetContractDetailsResult,
  DocumentType,
  ContractDetail,
} from 'src/sales-force-service';
import {
  SpringCMService,
  UploadDocToSpringParams,
} from 'src/spring-cm-service';
import { DocumentStatus } from 'src/entities';
import { DOCUMENT_QUEUE, MIGRATE_JOB } from './document.constants';
const { readFile, unlink } = fs.promises;

@Processor(DOCUMENT_QUEUE)
export class DocumentConsumer {
  private readonly logger = new Logger(DocumentConsumer.name);
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly documentRepository: DocumentRepository,
    private readonly nomenClatureRepository: NomenclatureWhitelistRepository,
    private readonly qrService: QRService,
    private readonly salesForceService: SalesForceService,
    private readonly springCMService: SpringCMService,
    private readonly datesUtil: DatesUtil,
  ) {}

  @Process(MIGRATE_JOB)
  async migrate(job: Job<number>): Promise<void> {
    const document = await this.documentRepository.getDocument(job.data);
    const {
      id: documentId,
      uuid: sysSrcFileName,
      qrCode: docQrCode,
      documentType: strGetDocTypeReqRes,
      contractDetails: strGetContDetailsReqRes,
      encodeValues: strEncodeValues,
      documentHistories,
    } = document;

    let qrCode = docQrCode;
    const buffer = await this.readFile(sysSrcFileName);

    let documentType: DocumentType,
      contractDetail: ContractDetail,
      encodeValues: EncodeValues;

    if (strGetDocTypeReqRes && strGetDocTypeReqRes !== '') {
      const getDocTypeReqResult = JSON.parse(strGetDocTypeReqRes);
      documentType = !!getDocTypeReqResult.response.length
        ? getDocTypeReqResult.response[0]
        : undefined;
    }

    if (strGetContDetailsReqRes && strGetContDetailsReqRes !== '') {
      const getContDetailsReqRes = JSON.parse(strGetContDetailsReqRes);
      contractDetail = !!getContDetailsReqRes?.reponse?.items.length
        ? getContDetailsReqRes.reponse.items[0]
        : undefined;
    }

    if (strEncodeValues && strEncodeValues !== '')
      encodeValues = JSON.parse(strEncodeValues);

    if (!documentType && encodeValues)
      documentType = await this.runGetContractDetails(documentId, encodeValues);

    if (!documentType && (!qrCode || qrCode === ''))
      qrCode = await this.runQr(documentId, buffer, sysSrcFileName);

    if (!documentType && qrCode && qrCode !== '')
      documentType = await this.runGetDocumentType(qrCode, documentId);

    if (!documentType) {
      await this.documentRepository.updateForManualEncode({
        documentId,
        processAt: this.datesUtil.getDateNow(),
      });
      return;
    }

    const isWhiteListed =
      await this.nomenClatureRepository.checkNomenclatureWhitelistIfExist(
        documentType.Nomenclature,
      );

    const isApproved = !!documentHistories?.filter(
      (h) =>
        h.documentStatus === DocumentStatus.APPROVED ||
        h.documentStatus === DocumentStatus.CHECKING_APPROVED,
    ).length;

    if (isWhiteListed && !isApproved) {
      await this.documentRepository.updateForChecking({
        documentId,
        processAt: this.datesUtil.getDateNow(),
      });
      return;
    }

    if (!isWhiteListed || isApproved) {
      const empty = '';
      const uploadParams = {
        Brand: documentType?.Brand ?? empty,
        CompanyCode: documentType?.CompanyCode ?? empty,
        ContractNo: documentType?.ContractNumber ?? empty,
        ProjectCode: documentType?.ProjectCode ?? empty,
        Tower_Phase: documentType?.TowerPhase ?? empty,
        CustomerCode: documentType?.CustomerCode ?? empty,
        ProjectName: documentType?.ProjectName ?? empty,
        CustomerName:
          (documentType?.AccountName ?? contractDetail?.CustomerName) || empty,
        UnitDescription: documentType?.UnitDetails ?? empty,
        DocumentGroupID: empty,
        DocumentGroupDescription: documentType?.DocumentGroup ?? empty,
        DocumentGroupShortDescription: empty,
        DocumentTypeID: empty,
        DocumentTypeDescription: documentType?.Nomenclature ?? empty,
        DocumentTypeShortDescription: empty,
        DocumentName: documentType?.Nomenclature ?? empty,
        ExternalSourceCaptureDate:
          this.datesUtil.getTimestamp('M/D/YYYY h:mm:ss A'),
        FileName: `${documentType?.Nomenclature}${path.extname(
          document.documentName,
        )}`,
        MIMEType: document.mimeType,
        DocumentDate: document.documentDate
          ? this.datesUtil.formatDateString(document.documentDate, 'MMDDYYYY')
          : empty,
        ExternalSourceUserID: document.user.username.split('@')[0],
        SourceSystem: 'RIS',
        DataCapDocSource: 'RIS',
        DataCapRemarks: document.remarks ?? empty,
        FileSize: document.documentSize.toString(),
        Remarks: document.remarks ?? empty,
        B64Attachment: buffer.toString('base64'),
      };

      await this.runUploadToSpringCM(documentId, uploadParams, sysSrcFileName);
    }
  }

  private async runQr(
    documentId: number,
    buffer: Buffer,
    filename: string,
  ): Promise<string> {
    await this.documentRepository.beginQrDocument({
      documentId,
      processAt: this.datesUtil.getDateNow(),
    });

    let qrCode;

    try {
      qrCode = await this.qrService.readPdfQrCode(buffer, filename);
    } catch (error) {
      await this.documentRepository.failQrDocument({
        documentId,
        errorMessage: error,
        failedAt: this.datesUtil.getDateNow(),
      });
      this.logger.error(error);
      throw error;
    }

    if (
      typeof qrCode === 'string' &&
      (qrCode.includes('exceptionCode') || qrCode.includes('Attention'))
    ) {
      const note = 'The license for QR Code module is invalid';
      await this.documentRepository.failQrDocument({
        documentId,
        errorMessage: note,
        failedAt: this.datesUtil.getDateNow(),
      });
      throw new Error(note);
    }

    if (qrCode?.match(/^ecr/i) || qrCode?.match(/^ecp/i)) {
      qrCode = qrCode;
    }

    if (qrCode?.match(/_/g)) {
      qrCode = qrCode.replace(/_/g, '|');
    }

    if (qrCode && qrCode.length >= 18) {
      qrCode = qrCode.substr(0, 15);
    }

    await this.documentRepository.qrDocument({
      documentId,
      qrCode,
      qrAt: this.datesUtil.getDateNow(),
    });

    return qrCode;
  }

  private async runGetDocumentType(
    qrCode: string,
    documentId: number,
  ): Promise<DocumentType | undefined> {
    await this.documentRepository.beginIndexing({
      documentId,
      processAt: this.datesUtil.getDateNow(),
    });

    const getDocTypeReqParams = {
      BarCode: qrCode,
    };
    let getDocTypeResult: GetDocumentTypeResult;
    let documentType: DocumentType;

    try {
      getDocTypeResult = await this.salesForceService.getDocumentType(
        getDocTypeReqParams,
      );
    } catch (error) {
      await this.documentRepository.failIndexing({
        documentId,
        docTypeReqParams: JSON.stringify(getDocTypeReqParams),
        salesforceResponse: !!getDocTypeResult
          ? JSON.stringify(getDocTypeResult)
          : error,
        failedAt: this.datesUtil.getDateNow(),
      });
      this.logger.error(error);
      throw error;
    }

    documentType = !!getDocTypeResult.response.length
      ? getDocTypeResult.response[0]
      : undefined;

    if (!documentType) {
      await this.documentRepository.failIndexing({
        documentId,
        docTypeReqParams: JSON.stringify(getDocTypeReqParams),
        salesforceResponse: JSON.stringify(getDocTypeResult),
        failedAt: this.datesUtil.getDateNow(),
      });
    }

    await this.documentRepository.doneIndexing({
      documentId,
      documentType: JSON.stringify(getDocTypeResult),
      docTypeReqParams: JSON.stringify(getDocTypeReqParams),
      indexedAt: this.datesUtil.getDateNow(),
    });

    return documentType;
  }

  private async runGetContractDetails(
    documentId: number,
    { contractNumber, companyCode, nomenclature, documentGroup }: EncodeValues,
  ): Promise<DocumentType | undefined> {
    await this.documentRepository.beginIndexing({
      documentId,
      processAt: this.datesUtil.getDateNow(),
    });

    const getContractDetailsReqParams = {
      ContractNumber: contractNumber,
      CompanyCode: companyCode,
    };
    let getContractDetailsResult: GetContractDetailsResult;
    let contractDetail: ContractDetail;

    try {
      getContractDetailsResult =
        await this.salesForceService.getContractDetails(
          getContractDetailsReqParams,
        );
    } catch (error) {
      await this.documentRepository.failIndexing({
        documentId,
        contractDetailsReqParams: JSON.stringify(getContractDetailsReqParams),
        salesforceResponse: !!getContractDetailsResult
          ? JSON.stringify(getContractDetailsResult)
          : error,
        failedAt: this.datesUtil.getDateNow(),
      });
      this.logger.error(error);
      throw error;
    }

    contractDetail =
      !!getContractDetailsResult?.response?.length &&
      !!getContractDetailsResult?.response[0].items?.length
        ? getContractDetailsResult.response[0].items[0]
        : undefined;

    if (!contractDetail) {
      await this.documentRepository.failIndexing({
        documentId,
        contractDetailsReqParams: JSON.stringify(getContractDetailsReqParams),
        salesforceResponse: JSON.stringify(getContractDetailsResult),
        failedAt: this.datesUtil.getDateNow(),
      });
    }

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

    const getDocTypeReqResult: GetDocumentTypeResult = {
      response: [documentType],
    };

    await this.documentRepository.doneIndexing({
      documentId,
      documentType: contractDetail
        ? JSON.stringify(getDocTypeReqResult)
        : undefined,
      contractDetails: JSON.stringify(getContractDetailsResult),
      contractDetailsReqParams: JSON.stringify(getContractDetailsReqParams),
      indexedAt: this.datesUtil.getDateNow(),
    });

    return contractDetail ? documentType : undefined;
  }

  private async runUploadToSpringCM(
    documentId: number,
    uploadParams: UploadDocToSpringParams,
    sysSrcFileName: string,
  ): Promise<void> {
    const { B64Attachment, ...forStrUploadParams } = uploadParams;
    const strUploadParams = JSON.stringify(forStrUploadParams);

    await this.documentRepository.beginMigrate({
      documentId,
      processAt: this.datesUtil.getDateNow(),
    });

    let uploadDocToSpringResult;

    try {
      uploadDocToSpringResult = await this.springCMService.uploadDocToSpring(
        uploadParams,
      );
    } catch (error) {
      await this.documentRepository.failMigrate({
        documentId,
        springcmReqParams: strUploadParams,
        springcmResponse: !!uploadDocToSpringResult
          ? JSON.stringify(uploadDocToSpringResult)
          : error,
        failedAt: this.datesUtil.getDateNow(),
      });
      this.logger.error(error);
      throw error;
    }

    const { data: response }: any = uploadDocToSpringResult;

    if (
      +response?.SpringCMAccessToken?.Code === 200 &&
      +response?.SpringCMGetFolder?.Code === 200 &&
      +response?.SpringCMUploadResponse?.Code === 201 &&
      !!response?.SalesForce?.length &&
      response?.SalesForce[0]?.created === 'true' &&
      response?.SalesForce[0]?.success === 'true'
    ) {
      await this.documentRepository.migrateDocument({
        documentId,
        springcmReqParams: strUploadParams,
        springcmResponse: JSON.stringify(response),
        migratedAt: this.datesUtil.getDateNow(),
      });
      await unlink(path.join(this.appConfigService.filePath, sysSrcFileName));
      await this.documentRepository.deleteFile({
        documentId,
        deletedAt: this.datesUtil.getDateNow(),
      });
    } else {
      await this.documentRepository.failMigrate({
        documentId,
        springcmReqParams: strUploadParams,
        springcmResponse: JSON.stringify(response),
        failedAt: this.datesUtil.getDateNow(),
      });
      throw new Error(response?.faultInfo?.message);
    }
  }

  private async readFile(sysSrcFileName: string): Promise<Buffer> {
    const location = path.join(this.appConfigService.filePath, sysSrcFileName);
    const buffer = await readFile(location);
    return buffer;
  }
}
