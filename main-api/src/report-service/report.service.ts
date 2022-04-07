import { Injectable } from '@nestjs/common';
import * as fileSize from 'filesize';
import { DocumentHistory } from 'src/entities';
import { ReportRepository } from 'src/repositories';
import { DatesUtil } from 'src/utils';
import {
  InformationRequestReport,
  QualityCheckReport,
  ApprovalReport,
  ImportReport,
  RISReport,
} from 'src/repositories/report';
import { ExcelService, ExcelColumn } from 'src/excel-service';
import { DEFAULT_DATE_FORMAT } from 'src/core/constants';
import { GetDocumentTypeResult, DocumentType } from 'src/sales-force-service';
import {
  GenerateUploadedExcelParam,
  GenerateInformationRequestExcekParam,
  GenerateQualityCheckExcelParam,
  GenerateApprovalExcelParam,
  GenerateImportExcelParam,
  GenerateRISReportParam,
} from './report.params';

@Injectable()
export class ReportService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly excelService: ExcelService,
    private readonly dateUtil: DatesUtil,
  ) {}

  private parseDocumentType(
    salesforceStrRes?: string,
  ): DocumentType | undefined {
    const salesforceRes: GetDocumentTypeResult =
      !!salesforceStrRes && salesforceStrRes !== ''
        ? JSON.parse(salesforceStrRes)
        : undefined;
    return !!salesforceRes?.response?.length
      ? salesforceRes.response[0]
      : undefined;
  }

  async generateUploadedExcel(
    param: GenerateUploadedExcelParam,
  ): Promise<Buffer> {
    const data = await this.reportRepository.getUploadedReport({
      uploader: param.uploader,
      from: param.from,
      to: param.to,
    });
    const columns: ExcelColumn<DocumentHistory>[] = [
      {
        key: 'createdDate',
        title: 'Date and Time',
        render: (dh) =>
          this.dateUtil.formatDate(dh.createdDate, DEFAULT_DATE_FORMAT),
      },
      {
        key: 'documentName',
        title: 'File Name',
        render: (dh) => dh?.document?.documentName?.toString(),
      },
      {
        key: 'userUsername',
        title: 'Uploader',
        dataIndex: 'userUsername',
      },
      {
        key: 'documentSize',
        title: 'File Size',
        render: (dh) => fileSize(dh.documentSize),
      },
      {
        key: 'pageTotal',
        title: 'Number of Pages',
        render: (dh) => dh?.document?.pageTotal?.toString(),
      },
    ];
    return await this.excelService.create({
      columns,
      rows: data,
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
    const columns: ExcelColumn<InformationRequestReport>[] = [
      {
        key: 'requestedDate',
        title: 'Date and Time',
        render: (report) =>
          this.dateUtil.formatDate(report.requestedDate, DEFAULT_DATE_FORMAT),
      },
      {
        key: 'filename',
        title: 'File Name',
        dataIndex: 'filename',
      },
      {
        key: 'encoder',
        title: 'Encoder',
        dataIndex: 'encoder',
      },
      {
        key: 'qrCode',
        title: 'Barcode / QR Code',
        dataIndex: 'qrCode',
      },
      {
        key: 'documentType',
        title: 'Document Type',
        render: (report) =>
          this.parseDocumentType(report.documentType)?.Nomenclature ?? '',
      },
      {
        key: 'documentSize',
        title: 'File Size',
        render: (report) => fileSize(report.documentSize),
      },
      {
        key: 'pageTotal',
        title: 'Number of Pages',
        dataIndex: 'pageTotal',
      },
      {
        key: 'documentStatus',
        title: 'Status',
        dataIndex: 'documentStatus',
      },
      {
        key: 'note',
        title: 'Note',
        dataIndex: 'note',
      },
    ];
    return await this.excelService.create({
      columns,
      rows: data,
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
    const columns: ExcelColumn<QualityCheckReport>[] = [
      {
        key: 'checkedDate',
        title: 'Date and Time',
        render: (report) =>
          this.dateUtil.formatDate(report.checkedDate, DEFAULT_DATE_FORMAT),
      },
      {
        key: 'filename',
        title: 'File Name',
        dataIndex: 'filename',
      },
      {
        key: 'checker',
        title: 'Checker',
        dataIndex: 'checker',
      },
      {
        key: 'qrCode',
        title: 'Barcode / QR Code',
        dataIndex: 'qrCode',
      },
      {
        key: 'documentType',
        title: 'Document Type',
        render: (report) =>
          this.parseDocumentType(report.documentType)?.Nomenclature ?? '',
      },
      {
        key: 'documentSize',
        title: 'File Size',
        render: (report) => fileSize(report.documentSize),
      },
      {
        key: 'pageTotal',
        title: 'Number of Pages',
        dataIndex: 'pageTotal',
      },
      {
        key: 'documentStatus',
        title: 'Status',
        dataIndex: 'documentStatus',
      },
      {
        key: 'note',
        title: 'Note',
        dataIndex: 'note',
      },
    ];
    return await this.excelService.create({
      columns,
      rows: data,
    });
  }

  async generateApprovalExcel(
    param: GenerateApprovalExcelParam,
  ): Promise<Buffer> {
    const data = await this.reportRepository.getApprovalReport({
      approver: param.approver,
      from: param.from,
      to: param.to,
    });
    const columns: ExcelColumn<ApprovalReport>[] = [
      {
        key: 'approvalDate',
        title: 'Date and Time',
        render: (report) =>
          this.dateUtil.formatDate(report.approvalDate, DEFAULT_DATE_FORMAT),
      },
      {
        key: 'filename',
        title: 'File Name',
        dataIndex: 'filename',
      },
      {
        key: 'approver',
        title: 'Approver',
        dataIndex: 'approver',
      },
      {
        key: 'qrCode',
        title: 'Barcode / QR Code',
        dataIndex: 'qrCode',
      },
      {
        key: 'documentType',
        title: 'Document Type',
        render: (report) =>
          this.parseDocumentType(report.documentType)?.Nomenclature ?? '',
      },
      {
        key: 'documentSize',
        title: 'File Size',
        render: (report) => fileSize(report.documentSize),
      },
      {
        key: 'pageTotal',
        title: 'Number of Pages',
        dataIndex: 'pageTotal',
      },
      {
        key: 'documentStatus',
        title: 'Status',
        dataIndex: 'documentStatus',
      },
      {
        key: 'note',
        title: 'Note',
        dataIndex: 'note',
      },
    ];
    return await this.excelService.create({
      columns,
      rows: data,
    });
  }

  async generateImportExcel(param: GenerateImportExcelParam): Promise<Buffer> {
    const data = await this.reportRepository.getImportReport({
      username: param.username,
      from: param.from,
      to: param.to,
    });
    const columns: ExcelColumn<ImportReport>[] = [
      {
        key: 'importedDate',
        title: 'Date and Time',
        render: (report) =>
          this.dateUtil.formatDate(report.importedDate, DEFAULT_DATE_FORMAT),
      },
      {
        key: 'filename',
        title: 'File Name',
        dataIndex: 'filename',
      },
      {
        key: 'username',
        title: 'User',
        dataIndex: 'username',
      },
      {
        key: 'qrCode',
        title: 'Barcode / QR Code',
        dataIndex: 'qrCode',
      },
      {
        key: 'documentType',
        title: 'Document Type',
        render: (report) =>
          this.parseDocumentType(report.documentType)?.Nomenclature ?? '',
      },
      {
        key: 'documentSize',
        title: 'File Size',
        render: (report) => fileSize(report.documentSize),
      },
      {
        key: 'pageTotal',
        title: 'Number of Pages',
        dataIndex: 'pageTotal',
      },
      {
        key: 'documentStatus',
        title: 'Status',
        dataIndex: 'documentStatus',
      },
      {
        key: 'note',
        title: 'Note',
        dataIndex: 'note',
      },
    ];
    return await this.excelService.create({
      columns,
      rows: data,
    });
  }

  async generateRISReportExcel(param: GenerateRISReportParam): Promise<Buffer> {
    const data = await this.reportRepository.getRISReport({
      scannerUsername: param.scannerUsername,
      nomenclature: param.nomenclature,
      statuses: param.statuses,
      from: param.from,
      to: param.to,
    });

    const columns: ExcelColumn<RISReport>[] = [
      {
        key: 'scannerName',
        title: 'Scanner Name',
        dataIndex: 'scannerName',
      },
      {
        key: 'scannerUsername',
        title: 'Scanner User Name',
        dataIndex: 'scannerUsername',
      },
      {
        key: 'scannerLocation',
        title: 'Scanner Location',
      },
      {
        key: 'fileName',
        title: 'File Name',
        dataIndex: 'fileName',
      },
      {
        key: 'pageTotal',
        title: 'Number of Pages',
        dataIndex: 'pageTotal',
      },
      {
        key: 'documentsCount',
        title: 'Number of Documents',
        dataIndex: 'documentsCount',
      },
      {
        key: 'fileSize',
        title: 'File Size',
        render: (report) => fileSize(report.fileSize),
      },
      {
        key: 'fileType',
        title: 'File Type',
        dataIndex: 'fileType',
      },
      {
        key: 'dateScanned',
        title: 'Date Scanned',
        render: (report) =>
          this.dateUtil.formatDate(report.dateScanned, DEFAULT_DATE_FORMAT),
      },
      {
        key: 'brand',
        title: 'Brand',
        render: (report) => this.parseDocumentType(report.indexes)?.Brand ?? '',
      },
      {
        key: 'companyCode',
        title: 'Company Code',
        render: (report) =>
          this.parseDocumentType(report.indexes)?.CompanyCode ?? '',
      },
      {
        key: 'contractNumber',
        title: 'Contract Number',
        render: (report) =>
          this.parseDocumentType(report.indexes)?.ContractNumber ?? '',
      },
      {
        key: 'customerNumber',
        title: 'Customer Number',
        render: (report) =>
          this.parseDocumentType(report.indexes)?.CustomerCode ?? '',
      },
      {
        key: 'accoutName',
        title: 'Account Name',
        render: (report) =>
          this.parseDocumentType(report.indexes)?.AccountName ?? '',
      },
      {
        key: 'projectName',
        title: 'Project Name',
        render: (report) =>
          this.parseDocumentType(report.indexes)?.ProjectName ?? '',
      },
      {
        key: 'unitDetails',
        title: 'Unit Details',
        render: (report) =>
          this.parseDocumentType(report.indexes)?.UnitDetails ?? '',
      },
      {
        key: 'dateIndexed',
        title: 'Date Indexed',
        render: (report) =>
          this.dateUtil.formatDate(report.dateIndexed, DEFAULT_DATE_FORMAT),
      },
      {
        key: 'indexedBy',
        title: 'Indexed By',
        dataIndex: 'indexedBy',
      },
      {
        key: 'documentGroup',
        title: 'Document Group',
        render: (report) =>
          this.parseDocumentType(report.indexes)?.DocumentGroup ?? '',
      },
      {
        key: 'document Type',
        title: 'Document Type',
        render: (report) =>
          this.parseDocumentType(report.indexes)?.Nomenclature ?? '',
      },
      {
        key: 'documentSource',
        title: 'Document Source',
        render: (report) => 'RIS',
      },
      {
        key: 'documentDate',
        title: 'Document Date',
        dataIndex: 'documentDate',
      },
      {
        key: 'dateUploaded',
        title: 'Date Uploaded',
        render: (report) =>
          this.dateUtil.formatDate(report.dateUploaded, DEFAULT_DATE_FORMAT),
      },
      {
        key: 'uploadedBy',
        title: 'Uploaded By',
        dataIndex: 'uploadedBy',
      },
      {
        key: 'remarks',
        title: 'Remarks',
        dataIndex: 'remarks',
      },
      {
        key: 'status',
        title: 'Status',
        dataIndex: 'status',
      },
      {
        key: 'notes',
        title: 'Notes',
        dataIndex: 'notes',
      },
      {
        key: 'errorDate',
        title: 'Date of Error Processing',
        render: (report) =>
          this.dateUtil.formatDate(report.errorDate, DEFAULT_DATE_FORMAT),
      },
    ];
    return await this.excelService.create({
      columns,
      rows: data,
    });
  }
}
