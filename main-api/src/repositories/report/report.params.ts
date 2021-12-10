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
  appover?: string;
  from?: Date;
  to?: Date;
  skip?: number;
  take?: number;
}
