import {
  getDocuments,
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
import { UseDocumentsParams } from './document.types';
import { QueryCacheKey } from 'core/enums';
import { ApiError } from 'core/types';
import {
  createTablePaginationQuery,
  createQueryString,
} from 'utils/query-string';

export { useDocuments, useUploadDoc };

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
