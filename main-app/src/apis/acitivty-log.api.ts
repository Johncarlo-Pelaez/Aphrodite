import { request } from './request';
import { ActivityLog } from 'models';
import {
  createQueryString,
  createTablePaginationQuery,
} from 'utils/query-string';
import moment from 'moment';
import {
  DEFAULT_DATE_PARAMS_FORMAT,
  DEFAULT_ALL_USER_SELECTED,
} from 'core/constants';

export interface GetActivityLogsApiResponse {
  count: number;
  data: ActivityLog[];
}

export interface UseActivityLogsFilterParams {
  loggedBy?: string;
  loggedAtFrom?: Date;
  loggedAtTo?: Date;
}

export interface UseActivityLog extends UseActivityLogsFilterParams {
  currentPage: number;
  pageSize: number;
}

// Request Acticity Logs from API
export const getActivityLogApi = async (
  params: UseActivityLog,
): Promise<GetActivityLogsApiResponse> => {
  const paginationQuery = createTablePaginationQuery({
    currentPage: params.currentPage,
    pageSize: params.pageSize,
  });

  const dateFromFilter = params.loggedAtFrom
    ? moment(params.loggedAtFrom).format(DEFAULT_DATE_PARAMS_FORMAT)
    : undefined;
  const dateToFilter = params.loggedAtTo
    ? moment(params.loggedAtTo).format(DEFAULT_DATE_PARAMS_FORMAT)
    : undefined;

  const filterQuery = createQueryString({
    loggedBy:
      params.loggedBy === DEFAULT_ALL_USER_SELECTED
        ? undefined
        : params.loggedBy,
    from: dateFromFilter,
    to: dateToFilter,
  });

  const res = await request.get<GetActivityLogsApiResponse>(
    `/api/activity-logs?${paginationQuery}&${filterQuery}`,
  );
  return res.data;
};

export type DownloadActivityLogsParams = UseActivityLog;

// Download Activty Logs from API
export const getDownloadActivityLogs = async (
  params: UseActivityLogsFilterParams,
): Promise<Blob> => {
  const dateFromFilter = params.loggedAtFrom
    ? moment(params.loggedAtFrom).format(DEFAULT_DATE_PARAMS_FORMAT)
    : undefined;
  const dateToFilter = params.loggedAtTo
    ? moment(params.loggedAtTo).format(DEFAULT_DATE_PARAMS_FORMAT)
    : undefined;

  const filterQuery = createQueryString({
    loggedBy:
      params.loggedBy === DEFAULT_ALL_USER_SELECTED
        ? undefined
        : params.loggedBy,
    from: dateFromFilter,
    to: dateToFilter,
  });

  const res = await request.get<Blob>(
    `/api/activity-logs/download?${filterQuery}`,
    {
      responseType: 'blob',
    },
  );

  return res.data;
};
