import { Injectable } from '@nestjs/common';
import Dynamsoft from 'dbr/dbr';
import { AppConfigService } from 'src/app-config';

@Injectable()
export class QRService {
  constructor(private readonly appConfigService: AppConfigService) {
    Dynamsoft.BarcodeReader.productKeys = this.appConfigService.barcodeLicense;
  }

  async readQRCode(imageBuffer: Buffer): Promise<string | undefined> {
    try {
      const reader = await Dynamsoft.BarcodeReader.createInstance();
      const results = await reader.decode(imageBuffer);
      reader.destroy();
      return !!results.length ? results[0].barcodeText : undefined;
    } catch (err) {
      throw err;
    }
  }
}
