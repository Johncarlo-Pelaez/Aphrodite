import { User } from './user';

export type Document = {
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
};

export type DocumentType = {
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
};
