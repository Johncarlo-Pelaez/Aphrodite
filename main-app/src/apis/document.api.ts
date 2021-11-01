import { CancelTokenSource, request } from './request';
import { Document } from 'models';
import {
  createQueryString,
  createTablePaginationQuery,
} from 'utils/query-string';

export { getDocumentsApi, getDocumentApi, uploadDocumentApi };

export interface GetDocumentsApi {
  currentPage: number;
  pageSize: number;
  search: string;
}

export interface GetDocumentsApiResponse {
  count: number;
  data: Document[];
}

const getDocumentsApi = async (
  params: GetDocumentsApi,
): Promise<GetDocumentsApiResponse> => {
  const paginationQuery = createTablePaginationQuery(params);
  const filterQuery = createQueryString({
    search: params.search,
  });

  const res = await request.get<GetDocumentsApiResponse>(
    `/api/documents?${paginationQuery}&${filterQuery}`,
  );
  return res.data;
};

const getDocumentApi = async (id: number): Promise<Document> => {
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

const uploadDocumentApi = async (
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
