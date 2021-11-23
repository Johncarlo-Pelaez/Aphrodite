import { DocumentStatus } from 'src/entities';

export interface DocFilterParam {
  search?: string;
  documentType?: string;
  statuses?: DocumentStatus[];
}

export interface CountParam extends DocFilterParam {}

export interface GetDocumentsParam extends DocFilterParam {
  skip?: number;
  take?: number;
}

export interface CreateDocumentParam {
  uuid: string;
  documentName: string;
  documentSize: number;
  mimeType: string;
  createdDate: Date;
  userId: number;
}

export interface BeginDocProcessParam {
  documentId: number;
  processAt: Date;
}

export interface QrDocumentParams {
  documentId: number;
  qrCode: string;
  qrAt: Date;
}

export interface FailDocProcessParam {
  documentId: number;
  failedAt: Date;
}

export interface DoneIndexingParam {
  documentId: number;
  indexedAt: Date;
  documentType: string;
  docTypeReqParams: string;
  contractDetails: string;
  contractDetailsReqParams: string;
}

export interface FailIndexingParam extends FailDocProcessParam {
  docTypeReqParams: string;
  contractDetailsReqParams: string;
}

export interface MigrateDocumentParam {
  documentId: number;
  migratedAt: Date;
  springReqParams: string;
  springResponse: string;
}

export interface FailDocMigrateParam extends FailDocProcessParam {
  springReqParams: string;
  springResponse?: string;
}

interface EncodeProcess {
  documentId: number;
  encodedAt: Date;
  encodedBy: number;
}

export interface EncodeQrBarcodeParams extends EncodeProcess {
  qrBarCode: string;
}

export interface EncodeAccountDetailsParams extends EncodeProcess {
  encodeValues: string;
}

export interface FailEncodeParam extends FailDocProcessParam {
  contractDetailsReqParams: string;
  encodeValues: string;
}

export interface CheckerApproveDocParam {
  documentId: number;
  documentDate: string;
  checkedAt: Date;
  checkedBy: number;
}

export interface CheckerDispproveDocParam extends CheckerApproveDocParam {
  remarks: string;
}

export interface ApproverApproveDisapproveDocParam {
  documentId: number;
  approver: number;
  modifiedAt: Date;
}

export interface UpdateForRetry extends BeginDocProcessParam {
  retryBy: number;
}
