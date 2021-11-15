import { Injectable } from '@nestjs/common';
import Dynamsoft from 'dbr/dbr';
import * as gm from 'gm';
import { AppConfigService } from 'src/app-config';
const imageMagick = gm.subClass({ imageMagick: true });

@Injectable()
export class QRService {
  constructor(private readonly appConfigService: AppConfigService) {
    Dynamsoft.BarcodeReader.productKeys = this.appConfigService.barcodeLicense;
  }

  async readImageQRCode(imageBuffer: Buffer): Promise<string | undefined> {
    const reader = await Dynamsoft.BarcodeReader.createInstance();
    const results = await reader.decode(imageBuffer);
    reader.destroy();
    return !!results.length ? results[0].barcodeText : undefined;
  }

  async readPdfQrCode(buffer: Buffer, srcFileName: string): Promise<string> {
    let qrCode;
    let pageIndex = 0;
    const pageCount = await this.countPage(buffer);

    do {
      const imageBuffer = await this.convertToImage(
        buffer,
        srcFileName,
        pageIndex,
      );
      qrCode = await this.readImageQRCode(imageBuffer);
      pageIndex++;
    } while (pageIndex < pageCount && !qrCode);

    return qrCode ?? '';
  }

  private async convertToImage(
    buffer: Buffer,
    srcFilename: string,
    pageIndex: number,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      imageMagick(buffer, `${srcFilename}[${pageIndex}]`).toBuffer(
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
}
