import { Document } from './document';
import { DocumentStatus } from 'core/enum';

export interface DocumentReport {
  id: number;
  description: string;
  documentSize: number;
  createdDate: Date;
  documentId: number;
  filename: string;
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

export interface RISReport {
  documentId: number;
  scannerUsername: string;
  scannerName: string;
  fileName: string;
  pageTotal: number;
  documentsCount: number;
  fileSize: number;
  fileType: string;
  dateScanned: Date;
  indexes: string;
  documentDate: string;
  indexedBy: string;
  dateIndexed: Date;
  uploadedBy: string;
  dateUploaded: Date;
  remarks: string;
  status: string;
  notes: string;
  errorDate: Date;
}
