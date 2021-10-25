import { request } from '../request';
import { Document } from 'models';
import {
  GetDocsResult,
  UploadDocParams,
  UploadDocResult,
} from './document.types';

export { getDocuments, getDocument, uploadDocument };

const getDocuments = async (query?: string): Promise<GetDocsResult> => {
  const res = await request.get<GetDocsResult>(`/api/documents?${query}`);
  return res.data;
};

const getDocument = async (id: number): Promise<Document> => {
  const res = await request.get<Document>(`/api/documents/${id}`);
  return res.data;
};

const uploadDocument = async (
  params: UploadDocParams,
): Promise<UploadDocResult> => {
  const { formData, onUploadProgress, cancelToken } = params;
  const res = await request.post<UploadDocResult>(`/api/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    cancelToken: cancelToken?.token,
    onUploadProgress: (progressEvent: ProgressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );
      onUploadProgress(percentCompleted);
    },
  });

  return res.data;
};
