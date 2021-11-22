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
