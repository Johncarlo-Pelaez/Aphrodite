export interface UploadDocuments {
  file: Express.Multer.File;
  uploadedBy: number;
}

export interface EncodeDocument {
  documentId: number;
  qrCode?: string;
  companyCode?: string;
  contractNumber?: string;
  nomenClature?: string;
  documentGroup?: string;
  encodedBy: number;
}
