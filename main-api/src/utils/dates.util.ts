import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class DatesUtil {
  getTimestamp(format?: string): string {
    return moment().format(format);
  }

  getDateNow(): Date {
    return moment().toDate();
  }

  formatDate(date: Date, format: string): string {
    return moment(date).format(format);
  }
}
