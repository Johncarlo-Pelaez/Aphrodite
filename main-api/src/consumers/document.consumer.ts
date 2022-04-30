import { Process, Processor } from '@nestjs/bull';
import { ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { Job } from 'bull';
import * as path from 'path';
import { DatesUtil, FilenameUtil } from 'src/utils';
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
import { SpringCMService } from 'src/spring-cm-service';
import { FileStorageService } from 'src/file-storage-service';
import { DocumentStatus } from 'src/entities';
import { DOCUMENT_QUEUE, MIGRATE_JOB } from './document.constants';
import { AxiosResponse } from 'axios';

@Processor(DOCUMENT_QUEUE)
export class DocumentConsumer {
  private readonly logger = new Logger(DocumentConsumer.name);
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly nomenClatureRepository: NomenclatureWhitelistRepository,
    private readonly qrService: QRService,
    private readonly salesForceService: SalesForceService,
    private readonly springCMService: SpringCMService,
    private readonly datesUtil: DatesUtil,
    private readonly filenameUtil: FilenameUtil,
    private readonly fileStorageService: FileStorageService,
  ) {}

  @Process(MIGRATE_JOB)
  async migrate(job: Job<number>): Promise<void> {
    const document = await this.documentRepository.getDocument(job.data);
    const {
      id: documentId,
      uuid: sysSrcFileName,
      qrCode: docQrCode,
      documentType: strGetDocTypeReqRes,
      encodeValues: strEncodeValues,
      documentHistories,
    } = document;

    let qrCode = docQrCode;
    let documentType: DocumentType, encodeValues: EncodeValues;

    if (strGetDocTypeReqRes && strGetDocTypeReqRes !== '') {
      const getDocTypeReqResult = JSON.parse(strGetDocTypeReqRes);
      documentType = !!getDocTypeReqResult.response.length
        ? getDocTypeReqResult.response[0]
        : undefined;
    }

    if (strEncodeValues && strEncodeValues !== '')
      encodeValues = JSON.parse(strEncodeValues);

    if (!documentType && encodeValues)
      documentType = await this.runGetContractDetails(documentId, encodeValues);

    if (!documentType && (!qrCode || qrCode === ''))
      qrCode = await this.runQr(documentId, sysSrcFileName);

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
      await this.runUploadToSpringCM(documentId);
    }
  }

  private async runQr(documentId: number, filename: string): Promise<string> {
    await this.documentRepository.beginQrDocument({
      documentId,
      processAt: this.datesUtil.getDateNow(),
    });

    let buffer: Buffer, qrCode: string;

    try {
      buffer = await this.fileStorageService.getFile(filename);
    } catch (err) {
      if (err instanceof NotFoundException) {
        await this.documentRepository.failQrDocument({
          documentId,
          errorMessage: 'File not found or missing file, It may be deleted.',
          failedAt: this.datesUtil.getDateNow(),
        });
      } else {
        await this.documentRepository.failQrDocument({
          documentId,
          errorMessage: `Error: ${err}`,
          failedAt: this.datesUtil.getDateNow(),
        });
      }
      throw err;
    }

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

    const dupDoc = await this.documentRepository.getDocumentByQRCode(
      qrCode,
      documentId,
    );

    if (
      qrCode &&
      !!dupDoc &&
      (!dupDoc?.isFileDeleted || dupDoc?.status === DocumentStatus.MIGRATE_DONE)
    ) {
      const note = 'QR code or Barcode is already exist.';
      await this.documentRepository.failQrDocument({
        documentId,
        errorMessage: note,
        failedAt: this.datesUtil.getDateNow(),
      });
      throw new ConflictException(note);
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
    } catch (err) {
      await this.documentRepository.failIndexing({
        documentId,
        docTypeReqParams: JSON.stringify(getDocTypeReqParams),
        salesforceResponse: !!getDocTypeResult
          ? JSON.stringify(getDocTypeResult)
          : null,
        errorMessage: err,
        failedAt: this.datesUtil.getDateNow(),
      });
      this.logger.error(err);
      throw err;
    }

    documentType = !!getDocTypeResult?.response?.length
      ? getDocTypeResult.response[0]
      : undefined;

    if (!documentType) {
      await this.documentRepository.failIndexing({
        documentId,
        docTypeReqParams: JSON.stringify(getDocTypeReqParams),
        salesforceResponse: getDocTypeResult
          ? JSON.stringify(getDocTypeResult)
          : null,
        errorMessage: 'Document details is empty.',
        failedAt: this.datesUtil.getDateNow(),
      });
    } else
    {
      await this.documentRepository.doneIndexing({
        documentId,
        documentType: JSON.stringify(getDocTypeResult),
        docTypeReqParams: JSON.stringify(getDocTypeReqParams),
        indexedAt: this.datesUtil.getDateNow(),
      });
    }

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
    } catch (err) {
      await this.documentRepository.failIndexing({
        documentId,
        contractDetailsReqParams: JSON.stringify(getContractDetailsReqParams),
        salesforceResponse: !!getContractDetailsResult
          ? JSON.stringify(getContractDetailsResult)
          : null,
        errorMessage: err,
        failedAt: this.datesUtil.getDateNow(),
      });
      this.logger.error(err);
      throw err;
    }

    contractDetail =
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

    if(!contractDetail) {
      await this.documentRepository.failIndexing({
        documentId,
        contractDetailsReqParams: JSON.stringify(getContractDetailsReqParams),
        salesforceResponse: getContractDetailsResult
          ? JSON.stringify(getContractDetailsResult)
          : null,
        errorMessage: 'Document details is empty.',
        failedAt: this.datesUtil.getDateNow(),
      });
    } else {
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
    }

    return contractDetail ? documentType : undefined;
  }

  private async runUploadToSpringCM(documentId: number): Promise<void> {
    const document = await this.documentRepository.getDocument(documentId);
    const {
      uuid: sysSrcFileName,
      documentType: strGetDocTypeReqRes,
      contractDetails: strGetContDetailsReqRes,
    } = document;

    const empty = '';
    let buffer: Buffer,
      documentType: DocumentType,
      contractDetail: ContractDetail;

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

    try {
      buffer = await this.fileStorageService.getFile(sysSrcFileName);
    } catch (err) {
      if (err instanceof NotFoundException) {
        await this.documentRepository.failMigrate({
          documentId,
          errorMessage: 'File not found or missing file, It may be deleted.',
          failedAt: this.datesUtil.getDateNow(),
        });
      } else {
        await this.documentRepository.failMigrate({
          documentId,
          errorMessage: err,
          failedAt: this.datesUtil.getDateNow(),
        });
      }
      throw err;
    }

    let uploadParams = {
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
      FileName: empty,
      MIMEType: document.mimeType,
      DocumentDate: document.documentDate
        ? this.datesUtil.formatDateString(document.documentDate, 'MM/DD/YYYY')
        : empty,
      ExternalSourceUserID: document.user.username.split('@')[0],
      SourceSystem: 'RIS',
      DataCapDocSource: 'RIS',
      DataCapRemarks: document.remarks ?? empty,
      FileSize: document.documentSize.toString(),
      Remarks: document.remarks ?? empty,
      B64Attachment: buffer.toString('base64'),
    };

    if (
      documentType?.Nomenclature.toLocaleLowerCase() ===
      "developer's official receipts"
    ) {
      uploadParams.FileName = `${uploadParams.CompanyCode}_${
        uploadParams.ContractNo
      }_${uploadParams.Remarks}_${
        document.documentDate
          ? this.datesUtil.formatDateString(document.documentDate, 'MMDDYYYY')
          : empty
        }${path.extname(document.documentName)}`;

      uploadParams.FileName = this.filenameUtil.removeCharsInvalid(uploadParams.FileName);
    } else {
      uploadParams.FileName = `${this.filenameUtil.removeNotAllowedChar(
        documentType?.Nomenclature?.replace(/\/|\\|\|/g, '_'),
      )}${path.extname(document.documentName)}`;

      uploadParams.FileName = this.filenameUtil.removeCharsInvalid(uploadParams.FileName);
    }

    const { B64Attachment, ...forStrUploadParams } = uploadParams;
    const strUploadParams = JSON.stringify(forStrUploadParams);

    await this.documentRepository.beginMigrate({
      documentId,
      processAt: this.datesUtil.getDateNow(),
    });

    let uploadDocToSpringResult:AxiosResponse;
    try {
      uploadDocToSpringResult = await this.springCMService.uploadDocToSpring(
        uploadParams
      );
    } catch(err) {
      const requestIncomingMessage = {
        StatusCode: +err.request?.res.statusCode,
        StatusMessage: err.request?.res.statusMessage,
      }

      await this.documentRepository.failMigrate({
        documentId,
        springcmReqParams: strUploadParams,
        springcmResponse: JSON.stringify(requestIncomingMessage),
        failedAt: this.datesUtil.getDateNow(),
        errorMessage: err,
      });
      this.logger.error(err);
      throw err;
    }

    const { data: springResponse }: any = uploadDocToSpringResult;
    const { request: clientResponse }: any = uploadDocToSpringResult;
    const requestIncomingMessage = {
      StatusCode: +clientResponse.request?.res.statusCode,
      StatusMessage: clientResponse.request?.res.statusMessage,
    }

    if(
      +springResponse?.SpringCMAccessToken?.Code === 200 &&
      +springResponse?.SpringCMGetFolder?.Code === 200 &&
      +springResponse?.SpringCMUploadResponse?.Code === 201 &&
      !!springResponse?.SalesForce?.length &&
      springResponse?.SalesForce[0]?.created === 'true') {
      await this.documentRepository.migrateDocument({
        documentId,
        springcmReqParams: strUploadParams,
        springcmResponse: JSON.stringify(springResponse),
        migratedAt: this.datesUtil.getDateNow(),
      });
      await this.fileStorageService.deleteFile(sysSrcFileName);
      await this.documentRepository.deleteFile({
        documentId,
        deletedAt: this.datesUtil.getDateNow(),
      });
    }
    else {
      await this.documentRepository.failMigrate({
        documentId,
        springcmReqParams: strUploadParams,
        springcmResponse: JSON.stringify(springResponse),
        errorMessage: `Client Request Error: ${JSON.stringify(requestIncomingMessage)}`,
        failedAt: this.datesUtil.getDateNow(),
      });
      throw new Error(springResponse?.faultInfo?.message);
    }
  }
}
