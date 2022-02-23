import { request } from '../request';
import { InformationRequestReport } from 'models';
import {
  createQueryString,
  createTablePaginationQuery,
} from 'utils/query-string';
import moment from 'moment';

import { DEFAULT_DATE_PARAMS_FORMAT } from 'core/constants';

export interface GetDocumentReportInfoRequestApiResponse {
  count: number;
  data: InformationRequestReport[];
}

export interface UseDocumentReportInfoRequestFilterParams {
  username?: string;
  from?: Date;
  to?: Date;
}

export interface UseInfoRequest
  extends UseDocumentReportInfoRequestFilterParams {
  currentPage: number;
  pageSize: number;
}

export const getDocumentReportApiInfoRequest = async (
  params: UseInfoRequest,
): Promise<GetDocumentReportInfoRequestApiResponse> => {
  const dateFromFilter = params.from
    ? moment(params.from).format(DEFAULT_DATE_PARAMS_FORMAT)
    : moment(new Date()).format(DEFAULT_DATE_PARAMS_FORMAT);
  const dateToFilter = params.to
    ? moment(params.to).format(DEFAULT_DATE_PARAMS_FORMAT)
    : moment(new Date()).format(DEFAULT_DATE_PARAMS_FORMAT);

  const paginationQuery = createTablePaginationQuery({
    currentPage: params.currentPage,
    pageSize: params.pageSize,
  });

  const filterQuery = createQueryString({
    encoder: params.username,
    from: dateFromFilter,
    to: dateToFilter,
  });

  const res = await request.get<GetDocumentReportInfoRequestApiResponse>(
    `/api/reports/information-request?${paginationQuery}&${filterQuery}`,
  );
  return res.data;
};

export type DownloadReportInfoRequestParams = UseInfoRequest;

export const getDownloadDocumentReportInfoRequest = async (
  params: UseDocumentReportInfoRequestFilterParams,
): Promise<Blob> => {
  const dateFromFilter = params.from
    ? moment(params.from).format(DEFAULT_DATE_PARAMS_FORMAT)
    : moment(new Date()).format(DEFAULT_DATE_PARAMS_FORMAT);
  const dateToFilter = params.to
    ? moment(params.to).format(DEFAULT_DATE_PARAMS_FORMAT)
    : moment(new Date()).format(DEFAULT_DATE_PARAMS_FORMAT);

  const filterQuery = createQueryString({
    encoder: params.username,
    from: dateFromFilter,
    to: dateToFilter,
  });

  const res = await request.get<Blob>(
    `/api/reports/information-request/download?${filterQuery}`,
    {
      responseType: 'blob',
    },
  );

  return res.data;
};
