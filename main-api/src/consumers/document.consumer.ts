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
      await this.runIndexing(qrCode, jobData);
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

  private async runIndexing(qrCode: string, jobData: JobData): Promise<void> {
    try {
      this.updateToIndexingBegin(jobData);
      const docTypeResult = await this.salesForceService.getDocumentType({
        BarCode: qrCode,
      });
      const contractDetailsResult =
        await this.salesForceService.getContractDetails({
          contractNumber: docTypeResult.response[0]?.ContractNumber,
          CompanyCode: docTypeResult.response[0]?.CompanyCode,
        });
      this.updateToIndexingDone(
        JSON.stringify(docTypeResult),
        JSON.stringify(contractDetailsResult),
        jobData,
      );
    } catch (err) {
      this.updateToIndexingFailed(err, jobData);
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

  private async updateToIndexingBegin(jobData: JobData): Promise<void> {
    const beginAt = this.datesUtil.getDateNow();
    await this.documentRepository.beginIndexing({
      documentId: jobData.documentId,
      beginAt,
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
}
