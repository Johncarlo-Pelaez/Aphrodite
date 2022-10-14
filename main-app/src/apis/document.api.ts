import moment from 'moment';
import { CancelTokenSource, request } from './request';
import { Document, DocumentHistory } from 'models';
import { DocumentStatus } from 'core/enum';
import { DEFAULT_DATE_PARAMS_FORMAT } from 'core/constants';
import {
  createQueryString,
  createTablePaginationQuery,
} from 'utils/query-string';

export interface GetDocumentsApi {
  currentPage: number;
  pageSize: number;
  search: string;
  statuses: DocumentStatus[];
  username?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface GetDocumentsApiResponse {
  count: number;
  data: Document[];
}

// Request Documents
export const getDocumentsApi = async (
  params: GetDocumentsApi,
): Promise<GetDocumentsApiResponse> => {
  const paginationQuery = createTablePaginationQuery(params);

  const dateFromFilter = params.dateFrom
    ? moment(params.dateFrom).format(DEFAULT_DATE_PARAMS_FORMAT)
    : undefined;
  const dateToFilter = params.dateFrom
    ? moment(params.dateTo).format(DEFAULT_DATE_PARAMS_FORMAT)
    : undefined;

  const filterQuery = createQueryString({
    search: params.search,
    statuses: params.statuses,
    username: params.username,
    from: dateFromFilter,
    to: dateToFilter,
  });

  const res = await request.get<GetDocumentsApiResponse>(
    `/api/documents?${paginationQuery}&${filterQuery}`,
  );
  return res.data;
};

// Request Get Document
export const getDocumentApi = async (id: number): Promise<Document> => {
  const res = await request.get<Document>(`/api/documents/${id}`);
  return res.data;
};

export interface UploadDocumentApi {
  file: File;
  onUploadProgress: (completedInPercent: number) => void;
  cancelToken?: CancelTokenSource;
}

export interface uploadDocumentApiResponse {
  id: number;
}

// Request Upload Documents
export const uploadDocumentApi = async (
  params: UploadDocumentApi,
): Promise<uploadDocumentApiResponse> => {
  const { file, onUploadProgress, cancelToken } = params;

  const formData = new FormData();
  formData.append('file', file, file.name);

  const res = await request.post<uploadDocumentApiResponse>(
    `/api/documents`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      cancelToken: cancelToken?.token,
      onUploadProgress: (progressEvent: ProgressEvent) => {
        const percent = Math.floor(
          (progressEvent.loaded * 100) / progressEvent.total,
        );

        onUploadProgress(percent);
      },
    },
  );

  return res.data;
};

// Request Document History
export const getDocumentHistoryApi = async (
  id: number,
): Promise<DocumentHistory[]> => {
  const res = await request.get<DocumentHistory[]>(
    `/api/documents/${id}/history`,
  );
  return res.data;
};

export interface EncodeDocQRBarcodeApi {
  documentId: number;
  qrBarCode: string;
}

// Request Manual Encode of Barcode in the Document
export const encodeDocQRBarcodeApi = async (
  params: EncodeDocQRBarcodeApi,
): Promise<void> => {
  const { documentId, ...rest } = params;
  await request.put(`/api/documents/${documentId}/encode/qrbarcode`, rest);
};

export interface EncodeDocDetailsApi {
  documentId: number;
  companyCode: string;
  contractNumber: string;
  nomenclature: string;
  documentGroup: string;
}

// Request Encode Document Details
export const encodeDocDetailsApi = async (
  params: EncodeDocDetailsApi,
): Promise<void> => {
  const { documentId, ...rest } = params;
  await request.put(`/api/documents/${documentId}/encode/details`, rest);
};

export interface CheckerApproveDocApi {
  documentDate: string;
  remarks: string;
  documentId: number;
}

// Request Checker Approve the Document
export const checkerApproveDocApi = async (
  params: CheckerApproveDocApi,
): Promise<void> => {
  const { documentId, ...rest } = params;
  await request.put(`/api/documents/${documentId}/checker/approve`, rest);
};

export interface CheckerDisapproveDocApi extends CheckerApproveDocApi {}

// Request Checker Disapprove the Document
export const checkerDisapproveDocApi = async (
  params: CheckerDisapproveDocApi,
): Promise<void> => {
  const { documentId, ...rest } = params;
  await request.put(`/api/documents/${documentId}/checker/disapprove`, rest);
};

// Request Approver Approve the Document
export const approverApproveDocApi = async (
  documentId: number,
): Promise<void> => {
  await request.put(`/api/documents/${documentId}/approver/approve`);
};

// Request Approver Disapprove the Document
export const approverDisapproveDocApi = async (
  documentId: number,
): Promise<void> => {
  await request.put(`/api/documents/${documentId}/approver/disapprove`);
};

// Request Retry the Documents
export const retryDocumentsApi = async (
  documentIds: number[],
): Promise<void> => {
  await request.put('/api/documents/retry', {
    documentIds,
  });
};

export interface GetDocumentsProcessCountApi {
  statuses: DocumentStatus[];
}

// Request Count of Documents Processed/Processing 
export const getDocumentsProcessCountApi = async (
  params: GetDocumentsProcessCountApi,
): Promise<number> => {
  const filterQuery = createQueryString({
    statuses: params.statuses,
  });

  const res = await request.get<number>(
    `/api/documents/process/count?${filterQuery}`,
  );
  return res.data;
};

// Request Cancel Documents Processing
export const cancelDocumentsApi = async (
  documentIds: number[],
): Promise<void> => {
  await request.put('/api/documents/cancel', {
    documentIds,
  });
};

// Request Cancel Waiting Documents
export const cancelWaitingDocumentsApi = async (): Promise<void> => {
  await request.put('/api/documents/cancel/waiting');
};

// Request Retry Error Documents
export const retryErrorDocumentsApi = async (): Promise<void> => {
  await request.put('/api/documents/retry/error');
};

// Request Delete Documents
export const deleteDocumentsFileApi = async (
  documentIds: number[],
): Promise<void> => {
  await request.delete('/api/documents', {
    data: {
      documentIds,
    },
  });
};

export interface ReplaceDocumentFileApi {
  documentId: number;
  file: File;
  onUploadProgress: (completedInPercent: number) => void;
  cancelToken?: CancelTokenSource;
}

// Request Replace the Document File
export const replaceDocumentFileApi = async (
  params: ReplaceDocumentFileApi,
): Promise<void> => {
  const { file, onUploadProgress, cancelToken } = params;

  const formData = new FormData();
  formData.append('file', file, file.name);

  await request.put<void>(
    `/api/documents/${params.documentId}/file`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      cancelToken: cancelToken?.token,
      onUploadProgress: (progressEvent: ProgressEvent) => {
        const percent = Math.floor(
          (progressEvent.loaded * 100) / progressEvent.total,
        );

        onUploadProgress(percent);
      },
    },
  );
};
