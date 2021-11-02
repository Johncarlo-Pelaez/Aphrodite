import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
  useQueryClient,
} from 'react-query';
import { Document } from 'models';
import { ApiError } from 'core/types';
import {
  getDocumentApi,
  getDocumentsApi,
  GetDocumentsApiResponse,
  UploadDocumentApi,
  uploadDocumentApiResponse,
  uploadDocumentApi,
} from 'apis';
import { QueryKey } from 'utils';

export interface UseDocuments {
  search: string;
  currentPage: number;
  pageSize: number;
}

export const useDocuments = (
  params: UseDocuments,
): UseQueryResult<GetDocumentsApiResponse, ApiError> => {
  return useQuery(QueryKey.buildPaginatedDocuments(params), () =>
    getDocumentsApi(params),
  );
};

export const useDocument = (
  id?: number,
): UseQueryResult<Document, ApiError> => {
  const queryClient = useQueryClient();
  return useQuery(
    QueryKey.buildDocument(id),
    () => getDocumentApi(id as number),
    {
      enabled: !!id,
      placeholderData: () => {
        const response = queryClient.getQueryData<GetDocumentsApiResponse>(
          QueryKey.paginatedDocuments,
        );

        return response?.data?.find((item) => item.id === id);
      },
    },
  );
};

export const useUploadDocument = (): UseMutationResult<
  uploadDocumentApiResponse,
  ApiError,
  UploadDocumentApi
> => {
  const queryClient = useQueryClient();
  return useMutation<uploadDocumentApiResponse, ApiError, UploadDocumentApi>(
    uploadDocumentApi,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.paginatedDocuments);
      },
    },
  );
};
