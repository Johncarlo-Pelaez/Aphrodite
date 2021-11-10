import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as fs from 'fs';
import * as path from 'path';
import * as gm from 'gm';
import { AppConfigService } from 'src/app-config';
import { DatesUtil } from 'src/utils';
import { DocumentRepository } from 'src/repositories';
import { QRService } from 'src/qr-service';
import { SalesForceService } from 'src/sales-force-service';
import {
  SpringCMService,
  UploadDocToSpringParams,
} from 'src/spring-cm-service';
import { JobData, JobIndexingResults } from './document.interfaces';
const imageMagick = gm.subClass({ imageMagick: true });

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

      const buffer = await this.readFile(jobData);

      const qrCode = document.qrCode ?? (await this.runQr(buffer, jobData));

      const { documentType, contractDetail } = await this.runIndexing(
        qrCode,
        jobData,
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

      await this.runUploadToSpringCM(jobData, uploadParams);
    } catch (err) {
      throw err;
    }
  }

  private async runQr(buffer: Buffer, jobData: JobData): Promise<string> {
    try {
      await this.updateToQrBegin(jobData);
      let qrCode;
      let pageIndex = 0;
      const pageCount = await this.countPage(buffer);

      do {
        const imageBuffer = await this.convertToImage(
          buffer,
          jobData,
          pageIndex,
        );

        qrCode = await this.qrService.readQRCode(imageBuffer);
        pageIndex++;
      } while (pageIndex < pageCount && !qrCode);

      if (!qrCode || qrCode === '') throw new Error('QR result is empty.');

      await this.updateToQrDone(qrCode, jobData);

      return qrCode;
    } catch (err) {
      await this.updateToQrFailed(err, jobData);
      throw err;
    }
  }

  private async runIndexing(
    qrCode: string,
    jobData: JobData,
  ): Promise<JobIndexingResults> {
    try {
      this.updateToIndexingBegin(jobData);

      const docTypeResult = await this.salesForceService.getDocumentType({
        BarCode: qrCode,
      });

      const documentType = !!docTypeResult.response.length
        ? docTypeResult.response[0]
        : undefined;

      let contractDetailsResult;

      if (documentType)
        contractDetailsResult = await this.salesForceService.getContractDetails(
          {
            contractNumber: documentType.ContractNumber,
            CompanyCode: documentType.CompanyCode,
          },
        );

      const contractDetail = !!contractDetailsResult?.reponse?.items.length
        ? contractDetailsResult.reponse.items[0]
        : undefined;

      if (!documentType || !contractDetail)
        throw new Error('Account details is empty.');

      this.updateToIndexingDone(
        JSON.stringify(docTypeResult),
        JSON.stringify(contractDetailsResult),
        jobData,
      );

      return {
        documentType,
        contractDetail,
      };
    } catch (err) {
      this.updateToIndexingFailed(err, jobData);
      throw err;
    }
  }

  private async runUploadToSpringCM(
    jobData: JobData,
    params: UploadDocToSpringParams,
  ): Promise<void> {
    try {
      this.updateToMigrateBegin(jobData);
      const { data: response }: any =
        await this.springCMService.uploadDocToSpring(params);
      if (
        +response?.SpringCMAccessToken?.Code === 200 &&
        +response?.SpringCMGetFolder?.Code === 200 &&
        +response?.SpringCMUploadResponse?.Code === 201 &&
        !!response?.SalesForce.length &&
        response?.SalesForce[0].created === 'true' &&
        response?.SalesForce[0].success === 'true'
      )
        this.updateToMigrateDone(JSON.stringify(response), jobData);
      else this.updateToMigrateFailed(null, JSON.stringify(response), jobData);
    } catch (err) {
      this.updateToMigrateFailed(err, null, jobData);
      throw err;
    }
  }

  private async updateToQrBegin(jobData: JobData): Promise<void> {
    const beginAt = this.datesUtil.getDateNow();
    await this.documentRepository.beginQrDocument({
      documentId: jobData.documentId,
      beginAt,
    });
  }

  private async readFile(jobData: JobData): Promise<Buffer> {
    const location = path.join(
      this.appConfigService.filePath,
      jobData.sysSrcFileName,
    );
    const buffer = await fs.promises.readFile(location);
    return buffer;
  }

  private async convertToImage(
    buffer: Buffer,
    jobData: JobData,
    pageIndex: number,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      imageMagick(buffer, `${jobData.sysSrcFileName}[${pageIndex}]`).toBuffer(
        'png',
        async (err, imageBuffer) => {
          if (!!err) {
            reject(err);
          } else {
            resolve(imageBuffer);
          }
        },
      );
    });
  }

  private async countPage(buffer: Buffer): Promise<number> {
    return new Promise((resolve, reject) => {
      imageMagick(buffer).identify(async (err, imageInfo) => {
        if (!!err) {
          reject(err);
        } else {
          resolve(
            Array.isArray(imageInfo.Format) ? imageInfo.Format.length : 1,
          );
        }
      });
    });
  }

  private async updateToQrDone(
    qrText: string,
    jobData: JobData,
  ): Promise<void> {
    const decodedAt = this.datesUtil.getDateNow();
    await this.documentRepository.qrDocument({
      documentId: jobData.documentId,
      qrCode: qrText,
      qrAt: decodedAt,
    });
  }

  private async updateToQrFailed(err: any, jobData: JobData): Promise<void> {
    const failedAt = this.datesUtil.getDateNow();
    await this.documentRepository.failQrDocument({
      documentId: jobData.documentId,
      failedAt,
    });
    this.logger.error(err);
  }

  private async updateToIndexingBegin(jobData: JobData): Promise<void> {
    const beginAt = this.datesUtil.getDateNow();
    await this.documentRepository.beginIndexing({
      documentId: jobData.documentId,
      beginAt,
    });
  }

  private async updateToIndexingDone(
    docType: string,
    contractDetails: string,
    jobData: JobData,
  ): Promise<void> {
    const indexedAt = this.datesUtil.getDateNow();
    await this.documentRepository.indexedDocument({
      documentId: jobData.documentId,
      documentType: docType,
      contractDetails: contractDetails,
      indexedAt,
    });
  }

  private async updateToIndexingFailed(
    err: any,
    jobData: JobData,
  ): Promise<void> {
    const failedAt = this.datesUtil.getDateNow();
    await this.documentRepository.failIndexing({
      documentId: jobData.documentId,
      failedAt,
    });
    this.logger.error(err);
  }

  private async updateToMigrateBegin(jobData: JobData): Promise<void> {
    const beginAt = this.datesUtil.getDateNow();
    await this.documentRepository.beginMigrate({
      documentId: jobData.documentId,
      beginAt,
    });
  }

  private async updateToMigrateDone(
    springResponse: string,
    jobData: JobData,
  ): Promise<void> {
    const migratedAt = this.datesUtil.getDateNow();
    await this.documentRepository.documentMigrate({
      documentId: jobData.documentId,
      springResponse,
      migratedAt,
    });
  }

  private async updateToMigrateFailed(
    err: any,
    springResponse: string,
    jobData: JobData,
  ): Promise<void> {
    const failedAt = this.datesUtil.getDateNow();
    await this.documentRepository.failMigrate({
      documentId: jobData.documentId,
      springResponse,
      failedAt,
    });
    this.logger.error(err);
  }
}
