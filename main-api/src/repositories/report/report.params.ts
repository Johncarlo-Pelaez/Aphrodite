import { DocumentStatus } from 'src/entities/document.enum';

export interface GetUploadedReportParam {
  uploader?: string;
  from?: Date;
  to?: Date;
  skip?: number;
  take?: number;
}

export interface GetInformationRequestReportParam {
  encoder?: string;
  from?: Date;
  to?: Date;
  skip?: number;
  take?: number;
}

export interface GetQualityCheckReportParam {
  checker?: string;
  from?: Date;
  to?: Date;
  skip?: number;
  take?: number;
}

export interface GetApprovalReportParam {
  approver?: string;
  from?: Date;
  to?: Date;
  skip?: number;
  take?: number;
}

export interface GetImportReportParam {
  username?: string;
  from?: Date;
  to?: Date;
  skip?: number;
  take?: number;
}

export interface GetRISReportParam {
  scannerUsername?: string;
  nomenclature?: string;
  statuses?: DocumentStatus[];
  from?: Date;
  to?: Date;
  skip?: number;
  take?: number;
}
