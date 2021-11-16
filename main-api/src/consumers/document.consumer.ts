import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as fs from 'fs';
import * as path from 'path';
import { AppConfigService } from 'src/app-config';
import { DatesUtil } from 'src/utils';
import { DocumentRepository, NomenClatureRepository } from 'src/repositories';
import { QRService } from 'src/qr-service';
import {
  SalesForceService,
  GetDocumentTypeResult,
  DocumentType,
  ContractDetail,
} from 'src/sales-force-service';
import {
  SpringCMService,
  UploadDocToSpringParams,
} from 'src/spring-cm-service';
import { DocumentStatus } from 'src/entities';
import {
  JobData,
  UpdateToIndexingDoneParams,
  UpdateToIndexingFailedParams,
} from './document.interfaces';

@Processor('document')
export class DocumentConsumer {
  private readonly logger = new Logger(DocumentConsumer.name);
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly documentRepository: DocumentRepository,
    private readonly nomenClatureRepository: NomenClatureRepository,
    private readonly qrService: QRService,
    private readonly salesForceService: SalesForceService,
    private readonly springCMService: SpringCMService,
    private readonly datesUtil: DatesUtil,
  ) {}

  @Process('migrate')
  async migrate(job: Job<number>): Promise<void> {
    const document = await this.documentRepository.getDocument(job.data);
    const jobData: JobData = {
      documentId: document.id,
      sysSrcFileName: document.uuid,
    };
    const { documentId, sysSrcFileName } = jobData;
    const {
      documentName,
      qrCode: docQrCode,
      status,
      documentType: strGetDocTypeReqRes,
      contractDetails: strGetContDetailsReqRes,
    } = document;
    const filename = path
      .basename(documentName, path.extname(documentName))
      .replace(/\.$/, '');
    let qrCode: string;
    const buffer = await this.readFile(sysSrcFileName);

    let documentType: DocumentType | undefined = undefined,
      contractDetail: ContractDetail | undefined = undefined;

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

    if (!documentType) {
      if (docQrCode && docQrCode !== '') {
        qrCode = docQrCode;
      } else if (filename.match(/^ecr/i) || filename.match(/^ecp/i)) {
        qrCode = filename;
      } else if (filename.match(/_/g)) {
        qrCode = filename.replace(/_/g, '|');
      } else if (filename.length === 18) {
        qrCode = filename.substr(0, 15);
      } else {
        qrCode = await this.runQr(buffer, jobData);
      }

      if (qrCode === '') {
        await this.updateForManualEncode(documentId);
        return;
      }

      documentType = await this.runIndexing(qrCode, documentId);
    }

    if (!documentType) {
      await this.updateForManualEncode(documentId);
      return;
    }

    const isWhiteListed =
      await this.nomenClatureRepository.checkNomenClatureIfExist(
        documentType.Nomenclature,
      );

    if (isWhiteListed && status !== DocumentStatus.APPROVED) {
      await this.updateForChecking(documentId);
      return;
    }

    if (!isWhiteListed || status === DocumentStatus.APPROVED) {
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
          ? this.datesUtil.formatDate(document.documentDate, 'MMDDYYYY')
          : empty,
        ExternalSourceUserID: document.user.email.split('@')[0],
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
    buffer: Buffer,
    { documentId, sysSrcFileName }: JobData,
  ): Promise<string> {
    await this.documentRepository.beginQrDocument({
      documentId,
      beginAt: this.datesUtil.getDateNow(),
    });

    let qrCode;

    try {
      qrCode = await this.qrService.readPdfQrCode(buffer, sysSrcFileName);
    } catch (error) {
      await this.updateToQrFailed(error, documentId);
      throw error;
    }

    await this.updateToQrDone(qrCode, documentId);

    return qrCode;
  }

  private async runIndexing(
    qrCode: string,
    documentId: number,
  ): Promise<DocumentType | undefined> {
    await this.documentRepository.beginIndexing({
      documentId,
      beginAt: this.datesUtil.getDateNow(),
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
      await this.updateToIndexingFailed({
        documentId,
        docTypeReqParams: JSON.stringify(getDocTypeReqParams),
        error,
      });
      throw error;
    }

    const documentType = !!getDocTypeResult.response.length
      ? getDocTypeResult.response[0]
      : undefined;

    await this.updateToIndexingDone({
      documentId,
      documentType: JSON.stringify(getDocTypeResult),
      docTypeReqParams: JSON.stringify(getDocTypeReqParams),
    });

    return documentType;
  }

  private async runUploadToSpringCM(
    documentId: number,
    uploadParams: UploadDocToSpringParams,
  ): Promise<void> {
    const { B64Attachment, ...forStrUploadParams } = uploadParams;
    const strUploadParams = JSON.stringify(forStrUploadParams);

    await this.documentRepository.beginMigrate({
      documentId,
      beginAt: this.datesUtil.getDateNow(),
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
    params: UpdateToIndexingDoneParams,
  ): Promise<void> {
    const indexedAt = this.datesUtil.getDateNow();
    await this.documentRepository.doneIndexing({
      documentId: params.documentId,
      documentType: params.documentType,
      contractDetails: params.contractDetails,
      docTypeReqParams: params.docTypeReqParams,
      contractDetailsReqParams: params.contractDetailsReqParams,
      indexedAt,
    });
  }

  private async updateToIndexingFailed(
    params: UpdateToIndexingFailedParams,
  ): Promise<void> {
    const failedAt = this.datesUtil.getDateNow();
    await this.documentRepository.failIndexing({
      documentId: params.documentId,
      documentType: params.documentType,
      contractDetails: params.contractDetails,
      docTypeReqParams: params.docTypeReqParams,
      contractDetailsReqParams: params.contractDetailsReqParams,
      failedAt,
    });
    this.logger.error(params.error);
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
    const beginAt = this.datesUtil.getDateNow();
    await this.documentRepository.updateForManualEncode({
      documentId,
      beginAt,
    });
  }

  private async updateForChecking(documentId: number): Promise<void> {
    const beginAt = this.datesUtil.getDateNow();
    await this.documentRepository.updateForChecking({
      documentId,
      beginAt,
    });
  }
}
