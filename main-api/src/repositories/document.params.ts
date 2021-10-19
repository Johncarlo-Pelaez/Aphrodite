export interface GetDocumentsParam {
  search?: string;
  skip?: number;
  take?: number;
}

export interface CreateDocumentParam {
  uuid: string;
  documentName: string;
  documentSize: number;
  createdDate: Date;
  userId: number;
}

export interface BeginQrDocumentParam {
  documentId: number;
  beginAt: Date;
}

export interface QrDocumentParams {
  documentId: number;
  qrCode: string;
  qrAt: Date;
}

export interface FailQrDocumentParam {
  documentId: number;
  failedAt: Date;
}

export interface BeginIndexingParam {
  documentId: number;
  beginAt: Date;
}

export interface IndexedDocumentParam {
  documentId: number;
  documentType: string;
  contractDetails: string;
  indexedAt: Date;
}

export interface FailIndexingParam {
  documentId: number;
  failedAt: Date;
}
