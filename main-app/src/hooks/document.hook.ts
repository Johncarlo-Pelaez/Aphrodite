import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
  useQueryClient,
} from 'react-query';
import { Document, DocumentHistory } from 'models';
import { ApiError } from 'core/types';
import {
  getDocumentApi,
  getDocumentsApi,
  GetDocumentsApiResponse,
  UploadDocumentApi,
  uploadDocumentApiResponse,
  uploadDocumentApi,
  getDocumentHistoryApi,
  EncodeDocumentApi,
  encodeDocumentApi,
  checkerApproveDocApi,
  checkerDisapproveDocApi,
  approverApproveDocApi,
  approverDisapproveDocApi,
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

export const useDocumentHistory = (
  id?: number,
): UseQueryResult<DocumentHistory[], ApiError> => {
  return useQuery(
    QueryKey.buildDocumentHistory(id),
    () => getDocumentHistoryApi(id as number),
    {
      enabled: !!id,
    },
  );
};

export const useEncodeDocument = (): UseMutationResult<
  void,
  ApiError,
  EncodeDocumentApi
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, EncodeDocumentApi>(encodeDocumentApi, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKey.paginatedDocuments);
    },
  });
};

export interface UseCheckerDocument {
  documentId: number;
  approve?: boolean;
  documentDate: string;
  remarks: string;
}

export const useCheckerDocument = (): UseMutationResult<
  void,
  ApiError,
  UseCheckerDocument
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, UseCheckerDocument>(
    async ({ approve = true, ...rest }) => {
      if (approve) {
        const { remarks, ...approveParams } = rest;
        await checkerApproveDocApi(approveParams);
      } else {
        await checkerDisapproveDocApi(rest);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.paginatedDocuments);
      },
    },
  );
};

export interface UseApproverDocument {
  documentId: number;
  approve?: boolean;
}

export const useApproverDocoment = (): UseMutationResult<
  void,
  ApiError,
  UseApproverDocument
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, UseApproverDocument>(
    async ({ documentId, approve = true }) => {
      if (approve) {
        await approverApproveDocApi(documentId);
      } else {
        await approverDisapproveDocApi(documentId);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.paginatedDocuments);
      },
    },
  );
};
