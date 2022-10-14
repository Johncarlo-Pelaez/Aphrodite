import { Injectable } from '@nestjs/common';
import * as Dynamsoft from 'dbr/dbr';
import * as gm from 'gm';
import * as pdfParse from 'pdf-parse';
import { AppConfigService } from 'src/app-config';
const imageMagick = gm.subClass({ imageMagick: true });

/*
 * Read document barcode
 */
@Injectable()
export class QRService {
  constructor(private readonly appConfigService: AppConfigService) {
    Dynamsoft.DBR.BarcodeReader.license = this.appConfigService.barcodeLicense;
    Dynamsoft.DBR.BarcodeReader.handshakeCode = this.appConfigService.handShakeCode;
    Dynamsoft.DBR.BarcodeReader.organizationID = this.appConfigService.organizationId;
  }

  async readImageQRCode(imageBuffer: Buffer): Promise<string | undefined> {
    const reader = await Dynamsoft.DBR.BarcodeReader.createInstance();
    const results = await reader.decode(imageBuffer);
    reader.destroy();
    return !!results.length ? results[0].barcodeText : undefined;
  }

  // Read document barcode
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

  // Convert the pages into an image
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
    const pdfData = await pdfParse(buffer);
    return pdfData.numpages;
  }
}
