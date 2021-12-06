import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { ExcelCreate } from './excel-service.types';

@Injectable()
export class ExcelService {
  constructor() {}

  async create(data: ExcelCreate): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet();

    sheet.columns = data.columns.map((c) => ({
      key: c.key,
      header: c.title,
    }));

    sheet.addRows(
      data.rows.map((items) => {
        const row: any = {};
        items.forEach((i) => {
          row[i.key] = i.value;
        });
        return row;
      }),
    );

    return (await workbook.xlsx.writeBuffer()) as Buffer;
  }
}
