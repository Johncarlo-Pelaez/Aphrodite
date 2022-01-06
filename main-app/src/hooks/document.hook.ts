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
  encodeDocDetailsApi,
  encodeDocQRBarcodeApi,
  checkerApproveDocApi,
  checkerDisapproveDocApi,
  approverApproveDocApi,
  approverDisapproveDocApi,
  retryDocumentsApi,
  getDocumentsProcessCountApi,
  cancelDocumentsApi,
  cancelWaitingDocumentsApi,
  retryErrorDocumentsApi,
  deleteDocumentsFileApi,
  ReplaceDocumentFileApi,
  replaceDocumentFileApi,
} from 'apis';
import { QueryKey } from 'utils';
import { DocumentStatus } from 'core/enum';

export interface UseDocuments {
  search: string;
  currentPage: number;
  pageSize: number;
  statuses: DocumentStatus[];
  username?: string;
  dateFrom?: Date;
  dateTo?: Date;
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

export interface UseEncodeDocument {
  documentId: number;
  qrBarCode: string;
  companyCode: string;
  contractNumber: string;
  nomenclature: string;
  documentGroup: string;
  isQRBarCode?: boolean;
}

export const useEncodeDocument = (): UseMutationResult<
  void,
  ApiError,
  UseEncodeDocument
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, UseEncodeDocument>(
    async ({ isQRBarCode = true, ...encodeParams }) => {
      if (isQRBarCode) {
        await encodeDocQRBarcodeApi({
          documentId: encodeParams.documentId,
          qrBarCode: encodeParams.qrBarCode,
        });
      } else {
        const { qrBarCode: qrCode, ...EncodeDocDetailsApi } = encodeParams;
        await encodeDocDetailsApi(EncodeDocDetailsApi);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.paginatedDocuments);
      },
    },
  );
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

export interface UseRetryDocumentsContext {
  prevDocs?: Document[];
}

export const useRetryDocuments = (): UseMutationResult<
  void,
  ApiError,
  number[],
  UseRetryDocumentsContext
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, number[], UseRetryDocumentsContext>(
    retryDocumentsApi,
    {
      onMutate: async (documentIds) => {
        await queryClient.cancelQueries(QueryKey.paginatedDocuments);
        const prevDocs = queryClient.getQueryData<Document[]>(
          QueryKey.paginatedDocuments,
        );
        queryClient.setQueryData<Document[]>(
          QueryKey.paginatedDocuments,
          (documents) =>
            !!documents
              ? documents.filter((d) => {
                  if (documentIds.includes(d.id)) {
                    d.status = DocumentStatus.RETRYING;
                  }
                  return true;
                })
              : [],
        );
        return { prevDocs };
      },
      onError: (_err, _documentIds, context) => {
        if (!!context) {
          queryClient.setQueryData(
            QueryKey.paginatedDocuments,
            context.prevDocs,
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(QueryKey.paginatedDocuments);
      },
    },
  );
};

export interface UseDocumentsProcessCount {
  statuses: DocumentStatus[];
}

export const useDocumentsProcessCount = (
  params: UseDocumentsProcessCount,
): UseQueryResult<number, ApiError> => {
  return useQuery(QueryKey.buildDocumentProcessCount(params), () =>
    getDocumentsProcessCountApi({ statuses: params.statuses }),
  );
};

export interface UseCancelDocumentsContext extends UseRetryDocumentsContext {}

export const useCancelDocuments = (): UseMutationResult<
  void,
  ApiError,
  number[],
  UseCancelDocumentsContext
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, number[], UseCancelDocumentsContext>(
    cancelDocumentsApi,
    {
      onMutate: async (documentIds) => {
        await queryClient.cancelQueries(QueryKey.paginatedDocuments);
        const prevDocs = queryClient.getQueryData<Document[]>(
          QueryKey.paginatedDocuments,
        );
        queryClient.setQueryData<Document[]>(
          QueryKey.paginatedDocuments,
          (documents) =>
            !!documents
              ? documents.filter((d) => {
                  if (documentIds.includes(d.id)) {
                    d.status = DocumentStatus.CANCELLED;
                  }
                  return true;
                })
              : [],
        );
        return { prevDocs };
      },
      onError: (_err, _documentIds, context) => {
        if (!!context) {
          queryClient.setQueryData(
            QueryKey.paginatedDocuments,
            context.prevDocs,
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(QueryKey.paginatedDocuments);
      },
    },
  );
};

export const useRetryErrorDocuments = (): UseMutationResult<
  void,
  ApiError,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, unknown>(retryErrorDocumentsApi, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKey.paginatedDocuments);
    },
  });
};

export const useCancelWaitingDocuments = (): UseMutationResult<
  void,
  ApiError,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, unknown>(cancelWaitingDocumentsApi, {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKey.paginatedDocuments);
    },
  });
};

export interface UseDeleteDocumentsFileContext
  extends UseRetryDocumentsContext {}

export const useDeleteDocumentsFile = (): UseMutationResult<
  void,
  ApiError,
  number[],
  UseDeleteDocumentsFileContext
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, number[], UseDeleteDocumentsFileContext>(
    deleteDocumentsFileApi,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.paginatedDocuments);
      },
    },
  );
};

export const useReplaceDocumentFile = (): UseMutationResult<
  void,
  ApiError,
  ReplaceDocumentFileApi
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, ReplaceDocumentFileApi>(
    replaceDocumentFileApi,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.paginatedDocuments);
      },
    },
  );
};
