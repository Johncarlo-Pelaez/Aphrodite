import { Module } from '@nestjs/common';
import {
  DatesUtil, FilenameUtil
} from '.';

@Module({
  providers: [
    DatesUtil, FilenameUtil
  ],
  exports: [DatesUtil, FilenameUtil],
})
export class UtilsModule {}
