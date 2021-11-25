import { DocumentStatus } from 'core/enum';
import { User } from './user';

export interface Document {
  id: number;
  documentName: string;
  documentSize: number;
  modifiedDate: string;
  description: string;
  status: DocumentStatus;
  qrCode: string;
  qrAt: string;
  documentType: string;
  contractDetails: string;
  user: User;
  documentDate: string;
  remarks: string;
}

export interface DocumentType {
  CompanyCode: string;
  ContractNumber: string;
  Brand: string;
  DocumentGroup: string;
  Nomenclature: string;
  CustomerCode: string;
  AccountName: string;
  ProjectName: string;
  UnitDetails: string;
  Transmittal: string;
  CodeType: string;
  ProjectCode: string;
  Tower_Phase: string;
}

export interface DocumentHistory {
  id: number;
  description: string;
  documentSize: number;
  createdDate: Date;
  documentId: number;
  document: Document;
  userUsername: string;
  user: User;
}

export interface Nomenclature {
  id: number;
  description: string;
}
