import {
  getActivityLogsApi,
  getActivityLogApi,
  GetActivityLogsApiResponse,
  getDownloadActivityLogs,
  DownloadActivityLogsParams,
  getActivityLogsFilter,
  UseActivityLogsFilterParams,
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

export const useActivityLogs = (): UseQueryResult<
  GetActivityLogsApiResponse,
  ApiError
> => {
  return useQuery(QueryKey.activityLogs, getActivityLogsApi);
};

export const useActivityLog = (
  params: UseActivityLog,
): UseQueryResult<GetActivityLogsApiResponse, ApiError> => {
  return useQuery(QueryKey.buildPaginatedActivityLogs(params), () =>
    getActivityLogApi(params),
  );
};

export const useActivityLogsFilter = (
  params: UseActivityLogsFilterParams,
): UseQueryResult<GetActivityLogsApiResponse[], ApiError> => {
  const { loggedBy, loggedAtFrom, loggedAtTo } = params;

  return useQuery<GetActivityLogsApiResponse[], ApiError>(
    [
      QueryKey.activityLogs,
      'activityLogs',
      { loggedBy, loggedAtFrom, loggedAtTo },
    ],
    () =>
      getActivityLogsFilter({
        loggedBy,
        loggedAtFrom,
        loggedAtTo,
      }),
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
