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

  formatDateString(date: string, format: string): string {
    return moment(date).format(format);
  }

  excelDateResult (date: Date, format: string): string {
    let dateResult = moment(date).format(format);
    return dateResult.toLowerCase() === "invalid date" ? '' : dateResult;
  }
}
