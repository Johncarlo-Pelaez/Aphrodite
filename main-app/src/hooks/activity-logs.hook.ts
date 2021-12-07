import { getActivityLogsApi, GetActivityLogsApi } from 'apis';
import { useQuery, UseQueryResult } from 'react-query';
import { QueryKey } from 'utils';
import { ApiError } from 'core/types';

export const useActivityLogs = (): UseQueryResult<
  GetActivityLogsApi,
  ApiError
> => {
  return useQuery(QueryKey.activityLogs, getActivityLogsApi);
};
