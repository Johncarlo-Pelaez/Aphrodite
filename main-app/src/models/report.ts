import { Document } from './document';
import { DocumentStatus } from 'core/enum';

export interface DocumentReport {
  id: number;
  description: string;
  documentSize: string;
  createdDate: Date;
  documentId: number;
  document: Document;
  userUsername: string;
  documentStatus: DocumentStatus;
  salesforceResponse: string;
  springcmResponse: string;
}
