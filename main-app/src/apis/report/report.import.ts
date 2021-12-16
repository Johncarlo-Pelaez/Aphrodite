import { request } from '../request';
import { ImportReport } from 'models';
import {
  createQueryString,
  createTablePaginationQuery,
} from 'utils/query-string';
import moment from 'moment';

import { DEFAULT_DATE_FORMAT } from 'core/constants';

export interface GetReportImportApiResponse {
  count: number;
  data: ImportReport[];
}

export interface UseReportImportFilterParams {
  username?: string;
  from?: Date;
  to?: Date;
}

export interface UseReportImport extends UseReportImportFilterParams {
  currentPage: number;
  pageSize: number;
}

export const getReportImportApi = async (
  params: UseReportImport,
): Promise<GetReportImportApiResponse> => {
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
    username: params.username,
    from: dateFromFilter,
    to: dateToFilter,
  });

  const res = await request.get<GetReportImportApiResponse>(
    `/api/reports/import?${paginationQuery}&${filterQuery}`,
  );
  return res.data;
};
