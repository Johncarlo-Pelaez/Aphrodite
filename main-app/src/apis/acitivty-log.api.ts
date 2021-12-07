import { request } from './request';
import { ActivityLog } from 'models';
import queryString from 'query-string';
import {
  createQueryString,
  createTablePaginationQuery,
} from 'utils/query-string';

export interface GetActivityLogsApiResponse {
  count: number;
  data: ActivityLog[];
}

export interface UseActivityLogsFilterParams {
  loggedBy: string;
  loggedAtFrom: Date | null;
  loggedAtTo: Date | null;
}

export interface UseActivityLog extends UseActivityLogsFilterParams {
  currentPage: number;
  pageSize: number;
}

export const getActivityLogsApi =
  async (): Promise<GetActivityLogsApiResponse> => {
    const res = await request.get<GetActivityLogsApiResponse>(
      '/api/activity-logs',
    );
    return res.data;
  };

export const getActivityLogApi = async (
  params: UseActivityLog,
): Promise<GetActivityLogsApiResponse> => {
  const paginationQuery = createTablePaginationQuery(params);
  if (params.loggedBy === 'All Users') {
    params.loggedBy = '';
  }

  const filterQuery = createQueryString({
    loggedBy: params.loggedBy,
    loggedAtFrom: params.loggedAtFrom?.toDateString(),
    loggedAtTo: params.loggedAtTo?.toDateString(),
  });

  const res = await request.get<GetActivityLogsApiResponse>(
    `/api/activity-logs?${paginationQuery}&${filterQuery}`,
  );
  return res.data;
};

export const getActivityLogsFilter = async (
  params: UseActivityLogsFilterParams,
): Promise<GetActivityLogsApiResponse[]> => {
  const queryParams = queryString.stringify(params);

  const res = await request.get<GetActivityLogsApiResponse[]>(
    `/api/activity-logs?${queryParams}`,
  );

  return res.data;
};

export type DownloadActivityLogsParams = UseActivityLogsFilterParams;

export const getDownloadActivityLogs = async (
  params: DownloadActivityLogsParams,
): Promise<Blob> => {
  const queryParams = queryString.stringify(params);

  const res = await request.get<Blob>(
    `/api/activity-logs/download?${queryParams}`,
    {
      responseType: 'blob',
    },
  );

  return res.data;
};
