import {
  GetReportRISApiResponse,
  getDownloadReportRIS,
  UseReportRIS,
  geReportRISApi,
  DownloadReportRISParams,
} from 'apis';

import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';
import { QueryKey } from 'utils';
import { ApiError } from 'core/types';

export const useReportRIS = (
  params: UseReportRIS,
): UseQueryResult<GetReportRISApiResponse, ApiError> => {
  return useQuery(QueryKey.buildPaginatedReportRIS(params), () =>
    geReportRISApi(params),
  );
};

export const useDownloadReportRIS = (): UseMutationResult<
  Blob,
  ApiError,
  DownloadReportRISParams
> => {
  return useMutation<Blob, ApiError, DownloadReportRISParams>(
    getDownloadReportRIS,
    {
      onError: () => {},
    },
  );
};
