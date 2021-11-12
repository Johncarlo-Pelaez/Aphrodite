import { ContractDetail, DocumentType } from 'src/sales-force-service';

export interface JobData {
  documentId: number;
  sysSrcFileName: string;
}

export interface JobIndexingResults {
  contractDetail?: ContractDetail;
  documentType?: DocumentType;
}

export interface UpdateToIndexingDoneParams {
  documentId: number;
  documentType?: string;
  contractDetails?: string;
  docTypeReqParams?: string;
  contractDetailsReqParams?: string;
}

export interface UpdateToIndexingFailedParams
  extends UpdateToIndexingDoneParams {
  error: any;
}
