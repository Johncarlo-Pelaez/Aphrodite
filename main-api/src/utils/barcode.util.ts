import { Injectable } from '@nestjs/common';
import { AlphaNumeric, AlphaNumericUndScore, QrEcr, QrEcp } from 'src/core/constants';

@Injectable()
export class BarcodeUtil {
  transformBarcode(barcode?: string): string {
    if (barcode.match(QrEcr) || barcode.match(QrEcp) && barcode.match(AlphaNumeric))
      return barcode;
    else if (barcode.length === 18 && barcode.match(AlphaNumeric)) 
      return barcode.substr(0, 15);
    else if (barcode.match(/_/g) && barcode.match(AlphaNumericUndScore)) {
      const barcodeSplit = barcode.split('_');
      let filenameBarcode = '';
      for (let i = 0; i < barcodeSplit.length; i++)
      {
        const nextItem = i + 1;
        if(barcodeSplit[i] && barcodeSplit[i].match(AlphaNumeric) && barcodeSplit[i] !== '')
          if(barcodeSplit[i] && barcodeSplit[nextItem])
            filenameBarcode += `${barcodeSplit[i]}|`;
          else filenameBarcode += barcodeSplit[i];
      }
      return filenameBarcode.trim();
    }
    else return barcode;
  }

  isFilenameAsBarcode(filename: string): boolean 
  {
    if ((filename.match(QrEcr) || filename.match(QrEcp)) && filename.match(AlphaNumeric))
      return true;
    else if (filename.length === 18 && filename.match(AlphaNumeric))
      return true;
    else if (filename.match(/_/g) && filename.match(AlphaNumericUndScore))
      return true;
    else return false;
  }
}