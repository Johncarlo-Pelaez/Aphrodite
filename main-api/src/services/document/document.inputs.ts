export interface UploadDocuments {
  file: Express.Multer.File;
  uploadedBy: number;
}

export interface EncodeDocDetails {
  documentId: number;
  encodedBy: number;
  companyCode: string;
  contractNumber: string;
  nomenclature: string;
  documentGroup: string;
}

export interface EncodeDocQRBarCode {
  documentId: number;
  encodedBy: number;
  qrBarCode: string;
}

export interface CheckerApproveDoc {
  documentId: number;
  documentDate: string;
  checkedBy: number;
}

export interface CheckerDisApproveDoc extends CheckerApproveDoc {
  remarks: string;
}

export interface DocumentApprover {
  documentId: number;
  approver: number;
}

export interface RetryDocuments {
  documentIds: number[];
  retryBy: number;
}
