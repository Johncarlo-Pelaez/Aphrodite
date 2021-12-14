import { Document } from './document';
import { DocumentStatus } from 'core/enum';

export interface DocumentReport {
  id: number;
  description: string;
  documentSize: string;
  createdDate: Date;
  documentId: number;
  document: Document;
  userUsername: string;
  documentStatus: DocumentStatus;
  salesforceResponse: string;
  springcmResponse: string;
}

export interface InformationRequestReport {
  documentId: number;
  documentSize: number;
  documentStatus: string;
  documentType: string;
  encoder: string;
  filename: string;
  note: string;
  pageTotal: number;
  qrCode: string;
  requestedDate: Date;
}

export interface QualityCheckReport {
  documentId: number;
  checkedDate: Date;
  filename: string;
  checker: string;
  qrCode: string;
  documentType: string;
  documentSize: number;
  pageTotal: number;
  documentStatus: number;
  note: string;
}

export interface ApprovalReport {
  documentId: number;
  approvalDate: Date;
  filename: string;
  approver: string;
  qrCode: string;
  documentType: string;
  documentSize: number;
  pageTotal: number;
  documentStatus: number;
  note: string;
}

export interface ImportReport {
  documentId: number;
  importedDate: Date;
  filename: string;
  username: string;
  qrCode: string;
  documentType: string;
  documentSize: number;
  pageTotal: number;
  documentStatus: number;
  note: string;
}
