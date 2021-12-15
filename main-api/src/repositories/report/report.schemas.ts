import { ApiProperty } from '@nestjs/swagger';

export class InformationRequestReport {
  @ApiProperty()
  documentId: number;

  @ApiProperty()
  requestedDate: Date;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  encoder: string;

  @ApiProperty()
  qrCode: string;

  @ApiProperty()
  documentType: string;

  @ApiProperty()
  documentSize: number;

  @ApiProperty()
  pageTotal: number;

  @ApiProperty()
  documentStatus: number;

  @ApiProperty()
  note: string;
}

export class QualityCheckReport {
  @ApiProperty()
  documentId: number;

  @ApiProperty()
  checkedDate: Date;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  checker: string;

  @ApiProperty()
  qrCode: string;

  @ApiProperty()
  documentType: string;

  @ApiProperty()
  documentSize: number;

  @ApiProperty()
  pageTotal: number;

  @ApiProperty()
  documentStatus: number;

  @ApiProperty()
  note: string;
}

export class ApprovalReport {
  @ApiProperty()
  documentId: number;

  @ApiProperty()
  approvalDate: Date;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  approver: string;

  @ApiProperty()
  qrCode: string;

  @ApiProperty()
  documentType: string;

  @ApiProperty()
  documentSize: number;

  @ApiProperty()
  pageTotal: number;

  @ApiProperty()
  documentStatus: number;

  @ApiProperty()
  note: string;
}

export class ImportReport {
  @ApiProperty()
  documentId: number;

  @ApiProperty()
  importedDate: Date;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  qrCode: string;

  @ApiProperty()
  documentType: string;

  @ApiProperty()
  documentSize: number;

  @ApiProperty()
  pageTotal: number;

  @ApiProperty()
  documentStatus: number;

  @ApiProperty()
  note: string;
}

export class RISReport {
  @ApiProperty()
  documentId: number;

  @ApiProperty()
  scannerUsername: string;

  @ApiProperty()
  scannerName: string;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  pageTotal: number;

  @ApiProperty()
  documentsCount: number;

  @ApiProperty()
  fileSize: number;

  @ApiProperty()
  fileType: string;

  @ApiProperty()
  dateScanned: Date;

  @ApiProperty()
  indexes: string;

  @ApiProperty()
  documentDate: string;

  @ApiProperty()
  indexedBy: string;

  @ApiProperty()
  dateIndexed: Date;

  @ApiProperty()
  uploadedBy: string;

  @ApiProperty()
  dateUploaded: Date;

  @ApiProperty()
  remarks: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  notes: string;

  @ApiProperty()
  errorDate: Date;
}
