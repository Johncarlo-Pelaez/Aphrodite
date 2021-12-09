import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as fileSize from 'filesize';
import { DocumentHistory, Document } from 'src/entities';
import { ReportRepository } from 'src/repositories';
import { InformationRequestReport } from 'src/repositories/report';
import { ExcelService, ExcelColumn, ExcelRowItem } from 'src/excel-service';
import { DEFAULT_DATE_FORMAT } from 'src/core/constants';
import { GetDocumentTypeResult } from 'src/sales-force-service';
import {
  GetUploadedReportParam,
  GetInformationRequestReportParam,
} from './report.params';

@Injectable()
export class ReportService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly excelService: ExcelService,
  ) {}

  private buildExcelRowItems(
    queryObject: Object,
    columns: ExcelColumn[],
  ): ExcelRowItem[] {
    return Object.entries(queryObject).reduce(
      (excelRowItem: ExcelRowItem[], [objectKey, objectValue]) => {
        if (objectKey === 'document' && objectValue instanceof Document) {
          Object.entries(objectValue).forEach(([docKey, value]) => {
            const column = columns.find((col) => col.key === docKey);
            if (column) {
              excelRowItem.push({
                key: column.key,
                value,
              });
            }
          });
        } else {
          const column = columns.find((col) => col.key === objectKey);
          if (column) {
            excelRowItem.push({
              key: column.key,
              value: objectValue,
            });
          }
        }
        return excelRowItem;
      },
      [],
    );
  }

  async getUploadedReport(
    param: GetUploadedReportParam,
  ): Promise<DocumentHistory[]> {
    return await this.reportRepository.getUploadedReport({
      uploadedBy: param.uploader,
      from: param.from,
      to: param.to,
      skip: param.skip,
      take: param.take,
    });
  }

  async getUploadedCountReport(param: GetUploadedReportParam): Promise<number> {
    return await this.reportRepository.getUploadedCountReport({
      uploadedBy: param.uploader,
      from: param.from,
      to: param.to,
    });
  }

  async generateUploadedExcelReport(
    param: GetUploadedReportParam,
  ): Promise<Buffer> {
    const data = await this.reportRepository.getUploadedReport({
      uploadedBy: param.uploader,
      from: param.from,
      to: param.to,
    });
    const columns: ExcelColumn[] = [
      {
        key: 'createdDate',
        title: 'Date and Time',
        render: (value) => moment(value).format(DEFAULT_DATE_FORMAT),
      },
      {
        key: 'documentName',
        title: 'File Name',
      },
      {
        key: 'userUsername',
        title: 'Uploader',
      },
      {
        key: 'documentSize',
        title: 'File Size',
        render: (value) => fileSize(value),
      },
      {
        key: 'pageTotal',
        title: 'Number of Pages',
      },
    ];
    return await this.excelService.create({
      columns,
      rows: data.map((documenHistory) =>
        this.buildExcelRowItems(documenHistory, columns),
      ),
    });
  }

  async getInformationRequestReport(
    param: GetInformationRequestReportParam,
  ): Promise<InformationRequestReport[]> {
    return await this.reportRepository.getInformationRequestReport({
      encoder: param.encoder,
      from: param.from,
      to: param.to,
      skip: param.skip,
      take: param.take,
    });
  }

  async getInformationRequestCountReport(
    param: GetInformationRequestReportParam,
  ): Promise<number> {
    return await this.reportRepository.getInformationRequestCountReport({
      encoder: param.encoder,
      from: param.from,
      to: param.to,
    });
  }

  async generateInformationRequestExcelReport(
    param: GetInformationRequestReportParam,
  ): Promise<Buffer> {
    const data = await this.reportRepository.getInformationRequestReport({
      encoder: param.encoder,
      from: param.from,
      to: param.to,
    });
    const columns: ExcelColumn[] = [
      {
        key: 'requestedDate',
        title: 'Date and Time',
        render: (value) => moment(value).format(DEFAULT_DATE_FORMAT),
      },
      {
        key: 'filename',
        title: 'File Name',
      },
      {
        key: 'encoder',
        title: 'Encoder',
      },
      {
        key: 'qrCode',
        title: 'Barcode / QR Code',
      },
      {
        key: 'documentType',
        title: 'Document Type',
        render: (value) => {
          const salesforceRes: GetDocumentTypeResult =
            !!value && value !== '' ? JSON.parse(value) : undefined;
          const nomenclature =
            !!salesforceRes && !!salesforceRes.response.length
              ? salesforceRes.response[0]
              : undefined;
          return !!nomenclature ? nomenclature?.Nomenclature : '';
        },
      },
      {
        key: 'documentSize',
        title: 'File Size',
        render: (value) => fileSize(value),
      },
      {
        key: 'pageTotal',
        title: 'Number of Pages',
      },
      {
        key: 'documentStatus',
        title: 'Status',
      },
      {
        key: 'note',
        title: 'Note',
      },
    ];
    return await this.excelService.create({
      columns,
      rows: data.map((infoReq) => this.buildExcelRowItems(infoReq, columns)),
    });
  }
}
