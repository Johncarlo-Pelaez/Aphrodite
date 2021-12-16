import { request } from '../request';
import { DocumentReport } from 'models';
import {
  createQueryString,
  createTablePaginationQuery,
} from 'utils/query-string';
import moment from 'moment';

import { DEFAULT_DATE_FORMAT } from 'core/constants';

export interface GetDocumentReportApiResponse {
  count: number;
  data: DocumentReport[];
}

export interface UseDocumentReportFilterParams {
  username?: string;
  from?: Date;
  to?: Date;
}

export interface UseDocumentReport extends UseDocumentReportFilterParams {
  currentPage: number;
  pageSize: number;
}

export const getDocumentReportApiUploaded = async (
  params: UseDocumentReport,
): Promise<GetDocumentReportApiResponse> => {
  const paginationQuery = createTablePaginationQuery({
    currentPage: params.currentPage,
    pageSize: params.pageSize,
  });

  const dateFromFilter = params.from
    ? moment(params.from).format(DEFAULT_DATE_FORMAT)
    : undefined;
  const dateToFilter = params.to
    ? moment(params.to).format(DEFAULT_DATE_FORMAT)
    : undefined;

  const filterQuery = createQueryString({
    uploader: params.username,
    from: dateFromFilter,
    to: dateToFilter,
  });

  const res = await request.get<GetDocumentReportApiResponse>(
    `/api/reports/uploaded?${paginationQuery}&${filterQuery}`,
  );
  return res.data;
};

export type DownloadDocumentReportUploadedParams = UseDocumentReport;

export const getDownloadDocumentReportUploaded = async (
  params: DownloadDocumentReportUploadedParams,
): Promise<Blob> => {
  const paginationQuery = createTablePaginationQuery(params);

  const dateFromFilter = params.from
    ? moment(params.from).format(DEFAULT_DATE_FORMAT)
    : undefined;
  const dateToFilter = params.to
    ? moment(params.to).format(DEFAULT_DATE_FORMAT)
    : undefined;

  const filterQuery = createQueryString({
    uploader: params.username,
    from: dateFromFilter,
    to: dateToFilter,
  });

  const res = await request.get<Blob>(
    `/api/reports/uploaded/download?${paginationQuery}&${filterQuery}`,
    {
      responseType: 'blob',
    },
  );

  return res.data;
};
