export interface UploadDocuments {
  file: Express.Multer.File;
  uploadedBy: string;
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
  checkedBy: string;
}

export interface CheckerDisApproveDoc extends CheckerApproveDoc {
  remarks: string;
}

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
