import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { ExcelCreate } from './excel-service.types';

@Injectable()
export class ExcelService {
  constructor() {}

  async create<T extends Record<string, any> = {}>(
    data: ExcelCreate<T>,
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet();

    sheet.columns = data.columns.map((c) => ({
      key: c.key,
      header: c.title,
    }));

    sheet.addRows(
      data.rows.map((rowData) => {
        const excelRow: any = {};
        data.columns.forEach(({ key, dataIndex, render }) => {
          excelRow[key] =
            !!render && typeof render === 'function'
              ? render(rowData)
              : (dataIndex && rowData && rowData[dataIndex]) || '';
        });
        return excelRow;
      }),
    );

    return (await workbook.xlsx.writeBuffer()) as Buffer;
  }
}
