import { DocumentStatus } from 'src/entities/document.enum';

export interface GenerateUploadedExcelParam {
  uploader?: string;
  from?: Date;
  to?: Date;
}

export interface GenerateInformationRequestExcekParam {
  encoder?: string;
  from?: Date;
  to?: Date;
}

export interface GenerateQualityCheckExcelParam {
  checker?: string;
  from?: Date;
  to?: Date;
}

export interface GenerateApprovalExcelParam {
  approver?: string;
  from?: Date;
  to?: Date;
}

export interface GenerateImportExcelParam {
  username?: string;
  from?: Date;
  to?: Date;
}

export interface GenerateRISReportParam {
  scannerUsername?: string;
  nomenclature?: string;
  statuses?: DocumentStatus[];
  from?: Date;
  to?: Date;
}
