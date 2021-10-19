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

export interface UpdateDocTypeParam {
  documentId: number;
  documentType: string;
  updatedAt: Date;
}

export interface UpdateDocContractDetailsParam {
  documentId: number;
  contractDetails: string;
  updatedAt: Date;
}

export interface FailSalesForceParam {
  documentId: number;
  failedAt: Date;
}
