import { request } from '../request';
import { QualityCheckReport } from 'models';
import {
  createQueryString,
  createTablePaginationQuery,
} from 'utils/query-string';
import moment from 'moment';

import { DEFAULT_DATE_FORMAT } from 'core/constants';

export interface GetDocumentReportQCApiResponse {
  count: number;
  data: QualityCheckReport[];
}

export interface UseDocumentReportQCFilterParams {
  username?: string;
  from?: Date;
  to?: Date;
}

export interface UseDocumentReportQC extends UseDocumentReportQCFilterParams {
  currentPage: number;
  pageSize: number;
}

export const getReportQCApi = async (
  params: UseDocumentReportQC,
): Promise<GetDocumentReportQCApiResponse> => {
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
    checker: params.username,
    from: dateFromFilter,
    to: dateToFilter,
  });

  const res = await request.get<GetDocumentReportQCApiResponse>(
    `/api/reports/quality-check?${paginationQuery}&${filterQuery}`,
  );
  return res.data;
};

export type DownloadReportQCParams = UseDocumentReportQC;

export const getDownloadQualityCheck = async (
  params: UseDocumentReportQCFilterParams,
): Promise<Blob> => {
  const dateFromFilter = params.from
    ? moment(params.from).format(DEFAULT_DATE_FORMAT)
    : undefined;
  const dateToFilter = params.to
    ? moment(params.to).format(DEFAULT_DATE_FORMAT)
    : undefined;

  const filterQuery = createQueryString({
    checker: params.username,
    from: dateFromFilter,
    to: dateToFilter,
  });

  const res = await request.get<Blob>(
    `/api/reports/quality-check/download?${filterQuery}`,
    {
      responseType: 'blob',
    },
  );

  return res.data;
};
