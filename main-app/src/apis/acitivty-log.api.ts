import { request } from './request';
import { ActivityLog } from 'models';
import queryString from 'query-string';

export interface GetActivityLogsApi {
  count: number;
  data: ActivityLog[];
}

export interface GetActivityLogsReportParams {
  loggedBy: string;
  loggedAt: Date;
}

export type DownloadActivityLogsParams = GetActivityLogsReportParams;

export const getActivityLogsApi = async (): Promise<GetActivityLogsApi> => {
  const res = await request.get<GetActivityLogsApi>('/api/activity-logs');
  return res.data;
};

export const getActivityLogsDownload = async () => {
  await request.get('api/activity-logs/download');
};

export const downloadActivityLogs = async (
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
