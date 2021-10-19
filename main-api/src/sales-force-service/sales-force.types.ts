export interface GetContractDetailsParams {
  contractNumber: string;
  CompanyCode: string;
}

export interface GetDocumentTypeParams {
  BarCode: string;
}

interface ItemDetail {
  ContractNumber: string;
  CompanyCode: string;
  Brand: string;
  ProjectCode: string;
  Tower_Phase: string;
  UnitDescription: string;
  CustomerCode: string;
  CustomerName: string;
}

interface ContractDetail {
  items: ItemDetail[];
}

export interface GetContractDetailsResult {
  reponse: ContractDetail[];
}

interface DocumentType {
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
