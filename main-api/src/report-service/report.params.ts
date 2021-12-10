export interface GenerateUploadedExcelParam {
  uploader?: string;
  from?: Date;
  to?: Date;
  skip?: number;
  take?: number;
}

export interface GenerateInformationRequestExcekParam {
  encoder?: string;
  from?: Date;
  to?: Date;
  skip?: number;
  take?: number;
}

export interface GenerateQualityCheckExcelParam {
  checker?: string;
  from?: Date;
  to?: Date;
  skip?: number;
  take?: number;
}

export interface GenerateApprovalExcelParam {
  approver?: string;
  from?: Date;
  to?: Date;
  skip?: number;
  take?: number;
}
