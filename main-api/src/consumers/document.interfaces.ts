import { ContractDetail, DocumentType } from 'src/sales-force-service';

export interface JobData {
  documentId: number;
  sysSrcFileName: string;
}

export interface JobIndexingResults {
  contractDetail?: ContractDetail;
  documentType?: DocumentType;
}
