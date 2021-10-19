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
import {
  SalesForceService,
  GetDocumentTypeResult,
} from 'src/sales-force-service';
import { JobData } from './document.interfaces';
const imageMagick = gm.subClass({ imageMagick: true });

@Processor('document')
export class DocumentConsumer {
  private readonly logger = new Logger(DocumentConsumer.name);
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly documentRepository: DocumentRepository,
    private readonly qrService: QRService,
    private readonly salesForceService: SalesForceService,
    private readonly datesUtil: DatesUtil,
  ) {}

  @Process('migrate')
  async migrate(job: Job<number>): Promise<void> {
    try {
      const document = await this.documentRepository.getDocument(job.data);
      const jobData: JobData = {
        documentId: document.id,
        fileName: document.uuid,
      };
      const qrCode = document.qrCode ?? (await this.runQr(jobData));
      const docTypeResult = await this.runGetDocType(qrCode, jobData);
      await this.runGetContractDetails(docTypeResult, jobData);
    } catch (err) {
      throw err;
    }
  }

  private async runQr(jobData: JobData): Promise<string> {
    try {
      await this.updateToQrBegin(jobData);
      const buffer = await this.readFile(jobData);
      const imageBuffer = await this.convertToImage(buffer, jobData);
      const qrCode = await this.qrService.readQRCode(imageBuffer);
      await this.updateToQrDone(qrCode, jobData);
      return qrCode;
    } catch (err) {
      await this.updateToQrFailed(err, jobData);
      throw err;
    }
  }

  private async runGetDocType(
    qrCode: string,
    jobData: JobData,
  ): Promise<GetDocumentTypeResult> {
    try {
      const docTypeResult = await this.salesForceService.getDocumentType({
        BarCode: qrCode,
      });
      const updatedAt = this.datesUtil.getDateNow();
      await this.documentRepository.updateDocType({
        documentId: jobData.documentId,
        documentType: JSON.stringify(docTypeResult),
        updatedAt,
      });
      return docTypeResult;
    } catch (err) {
      this.updateToSaleForceFailed(err, jobData);
      throw err;
    }
  }

  private async runGetContractDetails(
    docTypeResult: GetDocumentTypeResult,
    jobData: JobData,
  ): Promise<void> {
    try {
      const contractDetailsResult =
        await this.salesForceService.getContractDetails({
          contractNumber: docTypeResult.response[0]?.ContractNumber,
          CompanyCode: docTypeResult.response[0]?.CompanyCode,
        });
      const updatedAt = this.datesUtil.getDateNow();
      await this.documentRepository.updateDocContractDetails({
        documentId: jobData.documentId,
        contractDetails: JSON.stringify(contractDetailsResult),
        updatedAt,
      });
    } catch (err) {
      this.updateToSaleForceFailed(err, jobData);
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
      jobData.fileName,
    );
    const buffer = await fs.promises.readFile(location);
    return buffer;
  }

  private async convertToImage(
    buffer: Buffer,
    jobData: JobData,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      imageMagick(buffer, `${jobData.fileName}[0]`).toBuffer(
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

  private async updateToSaleForceFailed(
    err: any,
    jobData: JobData,
  ): Promise<void> {
    const failedAt = this.datesUtil.getDateNow();
    await this.documentRepository.failSalesForce({
      documentId: jobData.documentId,
      failedAt,
    });
    this.logger.error(err);
  }
}
