import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as fs from 'fs';
import * as path from 'path';
import { AppConfigService } from 'src/app-config';
import { DatesUtil } from 'src/utils';
import { DocumentRepository } from 'src/repositories';
import { QRService } from 'src/qr-service';
import { SalesForceService } from 'src/sales-force-service';
import {
  SpringCMService,
  UploadDocToSpringParams,
} from 'src/spring-cm-service';
import {
  JobData,
  JobIndexingResults,
  UpdateToIndexingDoneParams,
  UpdateToIndexingFailedParams,
} from './document.interfaces';

@Processor('document')
export class DocumentConsumer {
  private readonly logger = new Logger(DocumentConsumer.name);
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly documentRepository: DocumentRepository,
    private readonly qrService: QRService,
    private readonly salesForceService: SalesForceService,
    private readonly springCMService: SpringCMService,
    private readonly datesUtil: DatesUtil,
  ) {}

  @Process('migrate')
  async migrate(job: Job<number>): Promise<void> {
    try {
      const document = await this.documentRepository.getDocument(job.data);
      const jobData: JobData = {
        documentId: document.id,
        sysSrcFileName: document.uuid,
      };

      const buffer = await this.readFile(jobData.sysSrcFileName);

      const qrCode = document.qrCode ?? (await this.runQr(buffer, jobData));

      const { documentType, contractDetail } = await this.runIndexing(
        qrCode,
        jobData.documentId,
      );

      const empty = '';
      const uploadParams = {
        Brand: documentType?.Brand ?? empty,
        CompanyCode: documentType?.CompanyCode ?? empty,
        ContractNo: documentType?.ContractNumber ?? empty,
        ProjectCode: documentType?.ProjectCode ?? empty,
        Tower_Phase: documentType?.Tower_Phase ?? empty,
        CustomerCode: documentType?.CustomerCode ?? empty,
        ProjectName: documentType?.ProjectName ?? empty,
        CustomerName: contractDetail?.CustomerName ?? empty,
        UnitDescription: documentType?.UnitDetails ?? empty,
        DocumentGroupID: empty,
        DocumentGroupDescription: documentType?.DocumentGroup ?? empty,
        DocumentGroupShortDescription: empty,
        DocumentTypeID: empty,
        DocumentTypeDescription: documentType?.Nomenclature ?? empty,
        DocumentTypeShortDescription: empty,
        DocumentName: documentType?.Nomenclature ?? empty,
        ExternalSourceCaptureDate: empty,
        FileName: document.documentName,
        MIMEType: document.mimeType,
        DocumentDate: empty,
        ExternalSourceUserID: empty,
        SourceSystem: empty,
        DataCapDocSource: empty,
        DataCapRemarks: empty,
        FileSize: document.documentSize.toString(),
        Remarks: empty,
        B64Attachment: buffer.toString('base64'),
      };

      await this.runUploadToSpringCM(jobData.documentId, uploadParams);
    } catch (error) {
      throw error;
    }
  }

  private async runQr(
    buffer: Buffer,
    { documentId, sysSrcFileName }: JobData,
  ): Promise<string> {
    await this.documentRepository.beginMigrate({
      documentId,
      beginAt: this.datesUtil.getDateNow(),
    });

    let qrCode;

    try {
      (qrCode = await this),
        this.qrService.readPdfQrCode(buffer, sysSrcFileName);
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
  ): Promise<JobIndexingResults> {
    await this.documentRepository.beginIndexing({
      documentId,
      beginAt: this.datesUtil.getDateNow(),
    });

    const getDocTypeReqParams = {
      BarCode: qrCode,
    };
    let getDocTypeResult;

    try {
      getDocTypeResult = await this.salesForceService.getDocumentType(
        getDocTypeReqParams,
      );
    } catch (error) {
      this.updateToIndexingFailed({
        documentId,
        documentType: error,
        docTypeReqParams: JSON.stringify(getDocTypeReqParams),
        error,
      });
      throw error;
    } finally {
      this.updateToIndexingDone({
        documentId,
        documentType: JSON.stringify(getDocTypeResult),
        docTypeReqParams: JSON.stringify(getDocTypeReqParams),
      });
    }

    const documentType = !!getDocTypeResult.response.length
      ? getDocTypeResult.response[0]
      : undefined;

    if (!documentType) throw new Error('Document type is empty.');

    const getContractDetailsReqParams = {
      contractNumber: documentType?.ContractNumber,
      CompanyCode: documentType?.CompanyCode,
    };
    let getContractDetailsResult;

    try {
      getContractDetailsResult =
        await this.salesForceService.getContractDetails(
          getContractDetailsReqParams,
        );
    } catch (error) {
      this.updateToIndexingFailed({
        documentId,
        contractDetails: error,
        contractDetailsReqParams: JSON.stringify(getContractDetailsReqParams),
        error,
      });
      throw error;
    } finally {
      this.updateToIndexingDone({
        documentId,
        contractDetails: JSON.stringify(getContractDetailsResult),
        contractDetailsReqParams: JSON.stringify(getContractDetailsReqParams),
      });
    }

    const contractDetail = !!getContractDetailsResult?.reponse?.items.length
      ? getContractDetailsResult.reponse.items[0]
      : undefined;

    if (!contractDetail) throw new Error('Contract details is empty.');

    await this.documentRepository.doneIndexing({
      documentId,
      indexedAt: this.datesUtil.getDateNow(),
    });

    return {
      documentType,
      contractDetail,
    };
  }

  private async runUploadToSpringCM(
    documentId: number,
    uploadParams: UploadDocToSpringParams,
  ): Promise<void> {
    const { B64Attachment, ...forStrUploadParams } = uploadParams;
    const strUploadParams = JSON.stringify(forStrUploadParams);

    this.documentRepository.beginMigrate({
      documentId,
      beginAt: this.datesUtil.getDateNow(),
    });

    let uploadDocToSpringResult;

    try {
      uploadDocToSpringResult = await this.springCMService.uploadDocToSpring(
        uploadParams,
      );
    } catch (error) {
      this.updateToMigrateFailed(documentId, strUploadParams, error);
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
      this.updateToMigrateDone(
        documentId,
        JSON.stringify(response),
        strUploadParams,
      );
    else this.updateToMigrateFailed(documentId, strUploadParams);
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
    const {
      documentId,
      documentType,
      contractDetails,
      docTypeReqParams,
      contractDetailsReqParams,
    } = params;
    const indexedAt = this.datesUtil.getDateNow();
    await this.documentRepository.doneIndexing({
      documentId,
      documentType,
      contractDetails,
      docTypeReqParams,
      contractDetailsReqParams,
      indexedAt,
    });
  }

  private async updateToIndexingFailed(
    params: UpdateToIndexingFailedParams,
  ): Promise<void> {
    const {
      error,
      documentId,
      documentType,
      contractDetails,
      docTypeReqParams,
      contractDetailsReqParams,
    } = params;
    const failedAt = this.datesUtil.getDateNow();
    await this.documentRepository.failIndexing({
      documentId,
      documentType,
      contractDetails,
      docTypeReqParams,
      contractDetailsReqParams,
      failedAt,
    });
    this.logger.error(error);
  }

  private async updateToMigrateDone(
    documentId: number,
    springResponse: string,
    springReqParams: string,
  ): Promise<void> {
    const migratedAt = this.datesUtil.getDateNow();
    await this.documentRepository.documentMigrate({
      documentId,
      springResponse,
      springReqParams,
      migratedAt,
    });
  }

  private async updateToMigrateFailed(
    documentId: number,
    springReqParams: string,
    error?: any,
  ): Promise<void> {
    const failedAt = this.datesUtil.getDateNow();
    await this.documentRepository.failMigrate({
      documentId,
      springResponse: error,
      springReqParams,
      failedAt,
    });
    this.logger.error(error);
  }
}
