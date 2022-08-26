import { Module } from '@nestjs/common';
import {
  DatesUtil, FilenameUtil, BarcodeUtil
} from '.';

@Module({
  providers: [
    DatesUtil, FilenameUtil, BarcodeUtil
  ],
  exports: [DatesUtil, FilenameUtil, BarcodeUtil],
})
export class UtilsModule {}
