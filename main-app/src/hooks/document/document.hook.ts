import { getDocuments, GetDocsResult } from 'apis/document';
import { useQuery, UseQueryResult } from 'react-query';
import { UseDocumentsParams } from './document.type';
import { QueryCacheKey } from 'core/enums';
import { createTablePaginationQuery, createQueryString } from 'utils/query-string';

export { useDocuments };

const useDocuments = (
  params: UseDocumentsParams
): UseQueryResult<GetDocsResult> => {
  const { searchKey, currentPage, pageSize, isEnabled = true } = params;

  const paginationQuery = createTablePaginationQuery({
    currentPage: currentPage > 0 ? currentPage : 1,
    pageSize,
  });
  
  const filterQuery = createQueryString(
    {
      search: searchKey,
    },
    { arrayFormat: 'index' }
  )

  return useQuery<GetDocsResult>(
    [QueryCacheKey.DOCUMENTS, searchKey, currentPage, pageSize],
    () => getDocuments(`${paginationQuery}&${filterQuery}`),
    {
      enabled: isEnabled,
    }
  );
};