import {
  getActivityLogApi,
  GetActivityLogsApiResponse,
  getDownloadActivityLogs,
  DownloadActivityLogsParams,
  UseActivityLog,
} from 'apis';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';
import { QueryKey } from 'utils';
import { ApiError } from 'core/types';

export const useActivityLog = (
  params: UseActivityLog,
): UseQueryResult<GetActivityLogsApiResponse, ApiError> => {
  return useQuery(QueryKey.buildPaginatedActivityLogs(params), () =>
    getActivityLogApi(params),
  );
};

export const useDownloadActivityLogs = (): UseMutationResult<
  Blob,
  ApiError,
  DownloadActivityLogsParams
> => {
  return useMutation<Blob, ApiError, DownloadActivityLogsParams>(
    getDownloadActivityLogs,
    {
      onError: () => {},
    },
  );
};
