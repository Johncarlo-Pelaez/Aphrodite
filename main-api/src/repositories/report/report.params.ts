export interface GetUploadedReportParam {
  uploadedBy?: string;
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
