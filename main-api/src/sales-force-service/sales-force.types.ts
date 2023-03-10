export interface GetContractDetailsParams {
  ContractNumber: string;
  CompanyCode: string;
}

export interface GetDocumentTypeParams {
  BarCode: string;
}

export interface ContractDetail {
  ContractNumber: string;
  CompanyCode: string;
  Brand: string;
  ProjectCode: string;
  ProjectName: string;
  Tower_Phase: string;
  UnitDescription: string;
  CustomerCode: string;
  CustomerName: string;
}

export interface GetContractDetailsResult {
  response: [{ items: ContractDetail[] }];
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
  CopyType: string;
  ProjectCode: string;
  TowerPhase: string;
}

export interface GetDocumentTypeResult {
  response: DocumentType[];
}
