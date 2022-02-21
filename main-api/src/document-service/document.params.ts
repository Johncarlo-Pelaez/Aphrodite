export interface UploadDocument {
  file: Express.Multer.File;
  uploadedBy: string;
}

export interface ReplaceDocumentFile {
  documentId: number;
  file: Express.Multer.File;
  replacedBy: string;
}

export interface EncodeDocDetails {
  documentId: number;
  encodedBy: string;
  companyCode: string;
  contractNumber: string;
  nomenclature: string;
  documentGroup: string;
}

export interface EncodeDocQRBarCode {
  documentId: number;
  encodedBy: string;
  qrBarCode: string;
}

export interface CheckerApproveDoc {
  documentId: number;
  documentDate: string;
  remarks: string;
  checkedBy: string;
}

export interface CheckerDisApproveDoc extends CheckerApproveDoc {}

export interface DocumentApprover {
  documentId: number;
  approver: string;
}

export interface RetryDocuments {
  documentIds: number[];
  retriedBy: string;
}

export interface CancelDocuments {
  documentIds: number[];
  cancelledBy: string;
}

export interface DeleteDocuments {
  documentIds: number[];
  deletedBy: string;
}
