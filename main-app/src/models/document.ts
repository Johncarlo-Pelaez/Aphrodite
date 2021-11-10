import { User } from './user';

export interface Document {
  id: number;
  documentName: string;
  documentSize: number;
  modifiedDate: string;
  description: string;
  status: string;
  qrCode: string;
  qrAt: string;
  documentType: string;
  contractDetails: string;
  user: User;
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
  userId: number;
  user: User;
}

export interface NomenClature {
  id: number;
  description: string;
}
