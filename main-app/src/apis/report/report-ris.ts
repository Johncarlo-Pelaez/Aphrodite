import { request } from '../request';
import { RISReport } from 'models';
import {
  createQueryString,
  createTablePaginationQuery,
} from 'utils/query-string';
import moment from 'moment';
import { DocumentStatus } from 'core/enum';
import { DEFAULT_DATE_PARAMS_FORMAT } from 'core/constants';

export interface GetReportRISApiResponse {
  count: number;
  data: RISReport[];
}

export interface UseReportRISFilterParams {
  username?: string;
  from?: Date;
  to?: Date;
  statuses?: DocumentStatus[];
  nomenclature?: string;
}

export interface UseReportRIS extends UseReportRISFilterParams {
  currentPage: number;
  pageSize: number;
}

export const geReportRISApi = async (
  params: UseReportRIS,
): Promise<GetReportRISApiResponse> => {
  const dateFromFilter = params.from
    ? moment(params.from).format(DEFAULT_DATE_PARAMS_FORMAT)
    : undefined;
  const dateToFilter = params.to
    ? moment(params.to).format(DEFAULT_DATE_PARAMS_FORMAT)
    : undefined;

  const paginationQuery = createTablePaginationQuery({
    currentPage: params.currentPage,
    pageSize: params.pageSize,
  });

  const filterQuery = createQueryString({
    scannerUsername: params.username,
    from: dateFromFilter,
    to: dateToFilter,
    statuses: params.statuses,
    nomenclature: params.nomenclature,
  });

  const res = await request.get<GetReportRISApiResponse>(
    `/api/reports/ris?${paginationQuery}&${filterQuery}`,
  );
  return res.data;
};

export type DownloadReportRISParams = UseReportRIS;

export const getDownloadReportRIS = async (
  params: DownloadReportRISParams,
): Promise<Blob> => {
  const dateFromFilter = params.from
    ? moment(params.from).format(DEFAULT_DATE_PARAMS_FORMAT)
    : undefined;
  const dateToFilter = params.to
    ? moment(params.to).format(DEFAULT_DATE_PARAMS_FORMAT)
    : undefined;

  const paginationQuery = createTablePaginationQuery(params);

  const filterQuery = createQueryString({
    scannerUsername: params.username,
    from: dateFromFilter,
    to: dateToFilter,
    statuses: params.statuses,
    nomenclature: params.nomenclature,
  });

  const res = await request.get<Blob>(
    `/api/reports/ris/download?${paginationQuery}&${filterQuery}`,
    {
      responseType: 'blob',
    },
  );

  return res.data;
};
