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

export interface QrDocumentParam {
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
  springReqParams: string;
  springResponse: string;
}

export interface FailDocMigrateParam extends FailDocProcessParam {
  springReqParams: string;
  springResponse?: string;
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

export interface FailEncodeParam extends FailDocProcessParam {
  contractDetailsReqParams: string;
  encodeValues: string;
}

export interface CheckerApproveDocParam {
  documentId: number;
  documentDate: string;
  checkedAt: Date;
  checkedBy: string;
}

export interface CheckerDispproveDocParam extends CheckerApproveDocParam {
  remarks: string;
}

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
  deletedBy: string;
}
