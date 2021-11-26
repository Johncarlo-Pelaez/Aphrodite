import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as fs from 'fs';
import * as path from 'path';
import { AppConfigService } from 'src/app-config';
import { DatesUtil } from 'src/utils';
import { DocumentRepository, NomenclatureRepository } from 'src/repositories';
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

@Processor(DOCUMENT_QUEUE)
export class DocumentConsumer {
  private readonly logger = new Logger(DocumentConsumer.name);
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly documentRepository: DocumentRepository,
    private readonly nomenClatureRepository: NomenclatureRepository,
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
      status,
      documentType: strGetDocTypeReqRes,
      contractDetails: strGetContDetailsReqRes,
      encodeValues: strEncodeValues,
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
      await this.updateForManualEncode(documentId);
      return;
    }

    const isWhiteListed =
      await this.nomenClatureRepository.checkNomenclatureIfExist(
        documentType.Nomenclature,
      );

    if (
      isWhiteListed &&
      status !== DocumentStatus.APPROVED &&
      status !== DocumentStatus.CHECKING_APPROVED
    ) {
      await this.updateForChecking(documentId);
      return;
    }

    if (
      !isWhiteListed ||
      status === DocumentStatus.APPROVED ||
      status === DocumentStatus.CHECKING_APPROVED
    ) {
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

      await this.runUploadToSpringCM(documentId, uploadParams);
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
      await this.updateToQrFailed(error, documentId);
      throw error;
    }

    await this.updateToQrDone(qrCode, documentId);

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

    try {
      getDocTypeResult = await this.salesForceService.getDocumentType(
        getDocTypeReqParams,
      );
    } catch (error) {
      await this.updateToIndexingFailed(
        documentId,
        error,
        JSON.stringify(getDocTypeReqParams),
        null,
      );
      throw error;
    }

    const documentType = !!getDocTypeResult.response.length
      ? getDocTypeResult.response[0]
      : undefined;

    await this.updateToIndexingDone(
      documentId,
      JSON.stringify(getDocTypeResult),
      JSON.stringify(getDocTypeReqParams),
      null,
      null,
    );

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

    try {
      getContractDetailsResult =
        await this.salesForceService.getContractDetails(
          getContractDetailsReqParams,
        );
    } catch (error) {
      await this.updateToIndexingFailed(
        documentId,
        error,
        null,
        JSON.stringify(getContractDetailsReqParams),
      );
      throw error;
    }

    const contractDetail =
      !!getContractDetailsResult?.response?.length &&
      !!getContractDetailsResult?.response[0].items?.length
        ? getContractDetailsResult.response[0].items[0]
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

    const getDocTypeReqResult: GetDocumentTypeResult = {
      response: [documentType],
    };

    await this.updateToIndexingDone(
      documentId,
      contractDetail ? JSON.stringify(getDocTypeReqResult) : null,
      null,
      JSON.stringify(getContractDetailsResult),
      JSON.stringify(getContractDetailsReqParams),
    );

    return contractDetail ? documentType : undefined;
  }

  private async runUploadToSpringCM(
    documentId: number,
    uploadParams: UploadDocToSpringParams,
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
      await this.updateToMigrateFailed(
        documentId,
        strUploadParams,
        undefined,
        error,
      );
      throw error;
    }

    const { data: response }: any = uploadDocToSpringResult;

    if (
      +response?.SpringCMAccessToken?.Code === 200 &&
      +response?.SpringCMGetFolder?.Code === 200 &&
      +response?.SpringCMUploadResponse?.Code === 201 &&
      !!response?.SalesForce.length &&
      response?.SalesForce[0].created === 'true' &&
      response?.SalesForce[0].success === 'true'
    )
      await this.updateToMigrateDone(
        documentId,
        JSON.stringify(response),
        strUploadParams,
      );
    else
      await this.updateToMigrateFailed(
        documentId,
        strUploadParams,
        JSON.stringify(response),
      );
  }

  private async readFile(filename: string): Promise<Buffer> {
    const location = path.join(this.appConfigService.filePath, filename);
    const buffer = await fs.promises.readFile(location);
    return buffer;
  }

  private async updateToQrDone(
    qrCode: string,
    documentId: number,
  ): Promise<void> {
    const decodedAt = this.datesUtil.getDateNow();
    await this.documentRepository.qrDocument({
      documentId,
      qrCode,
      qrAt: decodedAt,
    });
  }

  private async updateToQrFailed(
    error: any,
    documentId: number,
  ): Promise<void> {
    const failedAt = this.datesUtil.getDateNow();
    await this.documentRepository.failQrDocument({
      documentId,
      failedAt,
    });
    this.logger.error(error);
  }

  private async updateToIndexingDone(
    documentId: number,
    documentType: string,
    docTypeReqParams: string,
    contractDetails: string,
    contractDetailsReqParams: string,
  ): Promise<void> {
    const indexedAt = this.datesUtil.getDateNow();
    await this.documentRepository.doneIndexing({
      documentId,
      documentType,
      docTypeReqParams,
      contractDetails,
      contractDetailsReqParams,
      indexedAt,
    });
  }

  private async updateToIndexingFailed(
    documentId: number,
    error: string,
    docTypeReqParams: string,
    contractDetailsReqParams: string,
  ): Promise<void> {
    const failedAt = this.datesUtil.getDateNow();
    await this.documentRepository.failIndexing({
      documentId,
      docTypeReqParams,
      contractDetailsReqParams,
      failedAt,
    });
    this.logger.error(error);
  }

  private async updateToMigrateDone(
    documentId: number,
    springReqParams: string,
    springResponse: string,
  ): Promise<void> {
    const migratedAt = this.datesUtil.getDateNow();
    await this.documentRepository.migrateDocument({
      documentId,
      springReqParams,
      springResponse,
      migratedAt,
    });
  }

  private async updateToMigrateFailed(
    documentId: number,
    springReqParams: string,
    springResponse?: string,
    error?: any,
  ): Promise<void> {
    const failedAt = this.datesUtil.getDateNow();
    await this.documentRepository.failMigrate({
      documentId,
      springReqParams,
      springResponse,
      failedAt,
    });
    this.logger.error(error);
  }

  private async updateForManualEncode(documentId: number): Promise<void> {
    const processAt = this.datesUtil.getDateNow();
    await this.documentRepository.updateForManualEncode({
      documentId,
      processAt,
    });
  }

  private async updateForChecking(documentId: number): Promise<void> {
    const processAt = this.datesUtil.getDateNow();
    await this.documentRepository.updateForChecking({
      documentId,
      processAt,
    });
  }
}
