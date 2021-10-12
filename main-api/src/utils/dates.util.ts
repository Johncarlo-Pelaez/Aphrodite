import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class DatesUtil {
  getTimestamp(): string {
    return moment().format();
  }

  getDateNow(): Date {
    return moment().toDate();
  }
}
