import { Injectable } from '@nestjs/common';
import { AlphaNumeric, AlphaNumericUndScore, QrEcr, QrEcp } from 'src/core/constants';

@Injectable()
export class BarcodeUtil {
  transformBarcode(barcode?: string): string {
    let qrCode;
    if (barcode.match(QrEcr) || barcode.match(QrEcp) && barcode.match(AlphaNumeric)) {
        qrCode = barcode;
    }
    if (barcode.length === 18 && barcode.match(AlphaNumeric)) {
        qrCode = barcode.substr(0, 15);
    }
    /*
    Raise if the filename with _ has more characters than others
    */
    if (barcode.match(/_/g) && barcode.match(AlphaNumericUndScore)) {
        const barcodeSplit = barcode.split('_');
        let filenameBarcode = '';
        for (let i = 0; i < barcodeSplit.length; i++)
        {
          const nextItem = i + 1;
          if(barcodeSplit[i] && barcodeSplit[i].match(AlphaNumeric) && barcodeSplit[i] !== "")
            if(barcodeSplit[i] && barcodeSplit[nextItem])
              filenameBarcode += `${barcodeSplit[i]}|`;
            else filenameBarcode += barcodeSplit[i];
        }
        qrCode = filenameBarcode.trim();
    }
    return qrCode;
  }
}