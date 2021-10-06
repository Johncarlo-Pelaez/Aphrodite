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
