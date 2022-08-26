import { Injectable } from '@nestjs/common';
import { AlphaNumeric, AlphaNumericUndScore } from 'src/core/constants';

@Injectable()
export class BarcodeUtil {
  transformBarcode(barcode?: string): string {
    let qrCode;
    if (barcode.match(/^ecr/i) || barcode.match(/^ecp/i) && barcode.match(AlphaNumeric)) {
        qrCode = barcode;
    }
    if (barcode.length === 18 && barcode.match(AlphaNumeric)) {
        qrCode = barcode.substr(0, 15);
    }
    /*
    Raise if the filename with _ has more characters than others
    */
    if (barcode.match(/_/g)) {
        qrCode = barcode.replace(/_/g, '|');
    }
    return qrCode;
  }
}