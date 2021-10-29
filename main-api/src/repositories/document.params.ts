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

export interface IndexedDocumentParam {
  documentId: number;
  documentType: string;
  contractDetails: string;
  indexedAt: Date;
}

export interface DocumentMigrateParam {
  documentId: number;
  migratedAt: Date;
  springResponse: string;
}

export interface FailDocMigrateParam {
  documentId: number;
  failedAt: Date;
  springResponse: string;
}
