import { Injectable } from '@nestjs/common';
import Dynamsoft from 'dbr/dbr';
import { AppConfigService } from 'src/app-config';

@Injectable()
export class QRService {
  constructor(private readonly appConfigService: AppConfigService) {
    Dynamsoft.BarcodeReader.productKeys = this.appConfigService.barcodeLicense;
  }

  async readQRCode(imageBuffer: Buffer): Promise<string> {
    try {
      const reader = await Dynamsoft.BarcodeReader.createInstance();
      const results = await reader.decode(imageBuffer);
      reader.destroy();
      if (!results.length) {
        throw new Error('QR result is empty.');
      }
      return results[0].barcodeText;
    } catch (err) {
      throw err;
    }
  }
}
