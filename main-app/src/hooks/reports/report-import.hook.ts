import {
  UseReportImport,
  GetReportImportApiResponse,
  getReportImportApi,
  UseReportImportFilterParams,
  getDownloadReportImport,
} from 'apis';

import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';
import { QueryKey } from 'utils';
import { ApiError } from 'core/types';

export const useReportImport = (
  params: UseReportImport,
): UseQueryResult<GetReportImportApiResponse, ApiError> => {
  return useQuery(QueryKey.buildPaginatedReportImport(params), () =>
    getReportImportApi(params),
  );
};

export const useDownloadReportImport = (): UseMutationResult<
  Blob,
  ApiError,
  UseReportImportFilterParams
> => {
  return useMutation<Blob, ApiError, UseReportImportFilterParams>(
    getDownloadReportImport,
    {
      onError: () => {},
    },
  );
};
