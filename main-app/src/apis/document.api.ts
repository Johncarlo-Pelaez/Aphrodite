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
    // username: params.username,
    from: dateFromFilter,
    to: dateToFilter,
  });

  const res = await request.get<GetDocumentsApiResponse>(
    `/api/documents?${paginationQuery}&${filterQuery}`,
  );
  return res.data;
};

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

export const checkerApproveDocApi = async (
  params: CheckerApproveDocApi,
): Promise<void> => {
  const { documentId, ...rest } = params;
  await request.put(`/api/documents/${documentId}/checker/approve`, rest);
};

export interface CheckerDisapproveDocApi extends CheckerApproveDocApi {}

export const checkerDisapproveDocApi = async (
  params: CheckerDisapproveDocApi,
): Promise<void> => {
  const { documentId, ...rest } = params;
  await request.put(`/api/documents/${documentId}/checker/disapprove`, rest);
};

export const approverApproveDocApi = async (
  documentId: number,
): Promise<void> => {
  await request.put(`/api/documents/${documentId}/approver/approve`);
};

export const approverDisapproveDocApi = async (
  documentId: number,
): Promise<void> => {
  await request.put(`/api/documents/${documentId}/approver/disapprove`);
};

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

export const cancelDocumentsApi = async (
  documentIds: number[],
): Promise<void> => {
  await request.put('/api/documents/cancel', {
    documentIds,
  });
};

export const cancelWaitingDocumentsApi = async (): Promise<void> => {
  await request.put('/api/documents/cancel/waiting');
};

export const retryErrorDocumentsApi = async (): Promise<void> => {
  await request.put('/api/documents/retry/error');
};

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
