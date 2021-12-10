import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as fileSize from 'filesize';
import { ReportRepository } from 'src/repositories';
import { ExcelService, ExcelColumn } from 'src/excel-service';
import { DEFAULT_DATE_FORMAT } from 'src/core/constants';
import { GetDocumentTypeResult } from 'src/sales-force-service';
import {
  GenerateUploadedExcelParam,
  GenerateInformationRequestExcekParam,
  GenerateQualityCheckExcelParam,
  GenerateApprovalExcelParam,
  GenerateImportExcelParam,
} from './report.params';

@Injectable()
export class ReportService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly excelService: ExcelService,
  ) {}

  async generateUploadedExcel(
    param: GenerateUploadedExcelParam,
  ): Promise<Buffer> {
    const data = await this.reportRepository.getUploadedReport({
      uploader: param.uploader,
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
        this.excelService.buildExcelRowItems(documenHistory, columns),
      ),
    });
  }

  async generateInformationRequestExcel(
    param: GenerateInformationRequestExcekParam,
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
          const nomenclature = !!salesforceRes?.response?.length
            ? salesforceRes.response[0]
            : undefined;
          return nomenclature?.Nomenclature ?? '';
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
      rows: data.map((infoReq) =>
        this.excelService.buildExcelRowItems(infoReq, columns),
      ),
    });
  }

  async generateQualityCheckExcel(
    param: GenerateQualityCheckExcelParam,
  ): Promise<Buffer> {
    const data = await this.reportRepository.getQualityCheckReport({
      checker: param.checker,
      from: param.from,
      to: param.to,
    });
    const columns: ExcelColumn[] = [
      {
        key: 'checkedDate',
        title: 'Date and Time',
        render: (value) => moment(value).format(DEFAULT_DATE_FORMAT),
      },
      {
        key: 'filename',
        title: 'File Name',
      },
      {
        key: 'checker',
        title: 'Checker',
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
          const nomenclature = !!salesforceRes?.response?.length
            ? salesforceRes.response[0]
            : undefined;
          return nomenclature?.Nomenclature ?? '';
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
      rows: data.map((qualityCheck) =>
        this.excelService.buildExcelRowItems(qualityCheck, columns),
      ),
    });
  }

  async generateApprovalExcel(
    param: GenerateApprovalExcelParam,
  ): Promise<Buffer> {
    const data = await this.reportRepository.getApprovalReport({
      appover: param.approver,
      from: param.from,
      to: param.to,
    });
    const columns: ExcelColumn[] = [
      {
        key: 'approvalDate',
        title: 'Date and Time',
        render: (value) => moment(value).format(DEFAULT_DATE_FORMAT),
      },
      {
        key: 'filename',
        title: 'File Name',
      },
      {
        key: 'approver',
        title: 'Approver',
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
          const nomenclature = !!salesforceRes?.response?.length
            ? salesforceRes.response[0]
            : undefined;
          return nomenclature?.Nomenclature ?? '';
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
      rows: data.map((qualityCheck) =>
        this.excelService.buildExcelRowItems(qualityCheck, columns),
      ),
    });
  }

  async generateImportExcel(param: GenerateImportExcelParam): Promise<Buffer> {
    const data = await this.reportRepository.getImportReport({
      username: param.username,
      from: param.from,
      to: param.to,
    });
    const columns: ExcelColumn[] = [
      {
        key: 'importedDate',
        title: 'Date and Time',
        render: (value) => moment(value).format(DEFAULT_DATE_FORMAT),
      },
      {
        key: 'filename',
        title: 'File Name',
      },
      {
        key: 'username',
        title: 'User',
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
          const nomenclature = !!salesforceRes?.response?.length
            ? salesforceRes.response[0]
            : undefined;
          return nomenclature?.Nomenclature ?? '';
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
      rows: data.map((qualityCheck) =>
        this.excelService.buildExcelRowItems(qualityCheck, columns),
      ),
    });
  }
}
