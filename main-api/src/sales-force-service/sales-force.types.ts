export interface GetContractDetailsParams {
  contractNumber: string;
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
  Tower_Phase: string;
  UnitDescription: string;
  CustomerCode: string;
  CustomerName: string;
}

export interface GetContractDetailsResult {
  reponse: { items: ContractDetail[] };
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

export interface GetDocumentTypeResult {
  response: DocumentType[];
}
