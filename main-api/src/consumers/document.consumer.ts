import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import Dynamsoft from 'dbr/dbr';
import * as fs from 'fs';
import * as path from 'path';
import * as gm from 'gm';
import { AppConfigService } from 'src/app-config';
import { DatesUtil } from 'src/utils';
import { DocumentRepository } from 'src/repositories';
import { JobData } from './document.interfaces';
const imageMagick = gm.subClass({ imageMagick: true });

@Processor('document')
export class DocumentConsumer {
  private readonly logger = new Logger(DocumentConsumer.name);
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly appConfigService: AppConfigService,
    private readonly datesUtil: DatesUtil,
  ) {
    Dynamsoft.BarcodeReader.productKeys = this.appConfigService.barcodeLicense;
  }

  @Process('migrate')
  async migrate(job: Job<number>): Promise<void> {
    const document = await this.documentRepository.getDocument(job.data);
    this.runQr({
      documentId: document.id,
      fileName: document.uuid.toLowerCase(),
    });
  }

  private async runQr(jobData: JobData): Promise<void> {
    try {
      await this.updateToQrBegin(jobData);
      const buffer = await this.readFile(jobData);
      const imageBuffer = await this.convertToImage(buffer, jobData);
      const qrText = await this.decode(imageBuffer);
      await this.updateToQrDone(qrText, jobData);
    } catch (err) {
      await this.updateToQrFailed(err, jobData);
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

  private async decode(buffer: Buffer): Promise<string> {
    const reader = await Dynamsoft.BarcodeReader.createInstance();
    const results = await reader.decode(buffer);
    reader.destroy();
    if (!results.length) {
      throw new Error('QR result is empty.');
    }
    return results[0].barcodeText;
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
}
