import { DocumentStatus } from 'src/entities';

export interface DocumentReportsFilterParam {
  statuses?: DocumentStatus[];
  username?: string;
  from?: Date;
  to?: Date;
}

export interface GetDocumentReportsCountParam
  extends DocumentReportsFilterParam {}

export interface GetUploadedReportsParam extends DocumentReportsFilterParam {
  skip?: number;
  take?: number;
}
