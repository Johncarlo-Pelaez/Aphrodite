import { Module } from '@nestjs/common';
import {
  DatesUtil,
} from '.';

@Module({
  providers: [
    DatesUtil,
  ],
  exports: [DatesUtil],
})
export class UtilsModule {}
