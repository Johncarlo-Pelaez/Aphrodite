export interface GetDocumentsParam {
  search?: string;
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
  beginAt: Date;
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
  documentType?: string;
  contractDetails?: string;
  docTypeReqParams?: string;
  contractDetailsReqParams?: string;
}

export interface FailIndexingParam extends FailDocProcessParam {
  documentType?: string;
  contractDetails?: string;
  docTypeReqParams?: string;
  contractDetailsReqParams?: string;
}

export interface DocumentMigrateParam {
  documentId: number;
  migratedAt: Date;
  springResponse: string;
  springReqParams: string;
}

export interface FailDocMigrateParam extends FailDocProcessParam {
  springResponse: string;
  springReqParams: string;
}
