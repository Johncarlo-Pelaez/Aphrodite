import {
  getDocuments,
  getDocument,
  uploadDocument,
  GetDocsResult,
  UploadDocResult,
  UploadDocParams,
} from 'apis/document';
import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
  useQueryClient,
} from 'react-query';
import { Document } from 'models';
import { QueryCacheKey } from 'core/enums';
import { ApiError } from 'core/types';
import {
  createTablePaginationQuery,
  createQueryString,
} from 'utils/query-string';

export { useDocuments, useUploadDoc, useDocument };

type UseDocumentsParams = {
  searchKey: string;
  currentPage: number;
  pageSize: number;
  isEnabled?: boolean;
};

const useDocuments = (
  params: UseDocumentsParams,
): UseQueryResult<GetDocsResult> => {
  const { searchKey, currentPage, pageSize, isEnabled = true } = params;

  const paginationQuery = createTablePaginationQuery({
    currentPage,
    pageSize,
  });

  const filterQuery = createQueryString(
    {
      search: searchKey,
    },
    { arrayFormat: 'index' },
  );

  return useQuery<GetDocsResult>(
    [QueryCacheKey.DOCUMENTS, searchKey, currentPage, pageSize],
    () => getDocuments(`${paginationQuery}&${filterQuery}`),
    {
      enabled: isEnabled,
    },
  );
};

type UseDocumentParams = {
  documentId?: number;
  isEnabled?: boolean;
};

const useDocument = (params: UseDocumentParams): UseQueryResult<Document> => {
  const { documentId, isEnabled } = params;
  const queryClient = useQueryClient();
  return useQuery<Document>(
    [QueryCacheKey.DOCUMENTS, documentId],
    () => getDocument(documentId as number),
    {
      enabled: isEnabled,
      placeholderData: () => {
        return queryClient
          .getQueryData<Document[]>(QueryCacheKey.DOCUMENTS)
          ?.find((document) => document.id === documentId);
      },
    },
  );
};

const useUploadDoc = (): UseMutationResult<
  UploadDocResult,
  ApiError,
  UploadDocParams
> => {
  const queryClient = useQueryClient();
  return useMutation<UploadDocResult, ApiError, UploadDocParams>(
    uploadDocument,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryCacheKey.DOCUMENTS);
      },
    },
  );
};
