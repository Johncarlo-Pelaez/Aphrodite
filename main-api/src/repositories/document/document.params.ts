import { DocumentStatus } from 'src/entities';

export interface GetDocumentsParam {
  search?: string;
  documentType?: string;
  statuses?: DocumentStatus[];
  username?: string;
  from?: Date;
  to?: Date;
  skip?: number;
  take?: number;
}

export interface CreateDocumentParam {
  uuid: string;
  documentName: string;
  documentSize: number;
  mimeType: string;
  qrCode?: string;
  createdDate: Date;
  username: string;
  pageTotal: number;
}

export interface BeginDocProcessParam {
  documentId: number;
  processAt: Date;
}

export interface FailDocProcessParam {
  documentId: number;
  errorMessage: string;
  failedAt: Date;
}

export interface QrDocumentParam {
  documentId: number;
  qrCode: string;
  qrAt: Date;
}

export interface DoneIndexingParam {
  documentId: number;
  documentType?: string;
  docTypeReqParams?: string;
  contractDetails?: string;
  contractDetailsReqParams?: string;
  indexedAt: Date;
}

export interface FailIndexingParam extends FailDocProcessParam {
  docTypeReqParams?: string;
  contractDetailsReqParams?: string;
  salesforceResponse?: string;
}

export interface MigrateDocumentParam {
  documentId: number;
  migratedAt: Date;
  springcmReqParams: string;
  springcmResponse: string;
}

export interface FailDocMigrateParam extends FailDocProcessParam {
  springcmReqParams?: string;
  springcmResponse?: string;
}

interface EncodeProcessParam {
  documentId: number;
  encodedAt: Date;
  encodedBy: string;
}

export interface EncodeQrBarcodeParam extends EncodeProcessParam {
  qrBarCode: string;
}

export interface EncodeAccountDetailsParam extends EncodeProcessParam {
  encodeValues: string;
}

export interface CheckerApproveDocParam {
  documentId: number;
  documentDate: string;
  remarks: string;
  checkedAt: Date;
  checkedBy: string;
}

export interface CheckerDispproveDocParam extends CheckerApproveDocParam {}

export interface ApproverApproveDisapproveDocParam {
  documentId: number;
  approver: string;
  modifiedAt: Date;
}

export interface UpdateForRetryParam extends BeginDocProcessParam {
  retriedBy: string;
}

export interface UpdateToCancelledParam extends BeginDocProcessParam {
  cancelledBy: string;
}

export interface DeleteFileParam {
  documentId: number;
  deletedAt: Date;
  deletedBy?: string;
}

export interface ReplaceFileParam {
  documentId: number;
  documentName: string;
  documentSize: number;
  mimeType: string;
  pageTotal: number;
  qrCode?: string;
  replacedAt: Date;
  replacedBy: string;
}
