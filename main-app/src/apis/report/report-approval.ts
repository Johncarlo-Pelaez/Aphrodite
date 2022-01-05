import { request } from '../request';
import { ApprovalReport } from 'models';
import {
  createQueryString,
  createTablePaginationQuery,
} from 'utils/query-string';
import moment from 'moment';

import { DEFAULT_DATE_PARAMS_FORMAT } from 'core/constants';

export interface GetReportApprovalApiResponse {
  count: number;
  data: ApprovalReport[];
}

export interface UseReportApprovalFilterParams {
  username?: string;
  from?: Date;
  to?: Date;
}

export interface UseReportApproval extends UseReportApprovalFilterParams {
  currentPage: number;
  pageSize: number;
}

export const getReportApprovalApi = async (
  params: UseReportApproval,
): Promise<GetReportApprovalApiResponse> => {
  const paginationQuery = createTablePaginationQuery({
    currentPage: params.currentPage,
    pageSize: params.pageSize,
  });

  const dateFromFilter = params.from
    ? moment(params.from).format(DEFAULT_DATE_PARAMS_FORMAT)
    : undefined;
  const dateToFilter = params.to
    ? moment(params.to).format(DEFAULT_DATE_PARAMS_FORMAT)
    : undefined;

  const filterQuery = createQueryString({
    approver: params.username,
    from: dateFromFilter,
    to: dateToFilter,
  });

  const res = await request.get<GetReportApprovalApiResponse>(
    `/api/reports/approval?${paginationQuery}&${filterQuery}`,
  );
  return res.data;
};

export const getDownloadDocumentReportApproval = async (
  params: UseReportApprovalFilterParams,
): Promise<Blob> => {
  const dateFromFilter = params.from
    ? moment(params.from).format(DEFAULT_DATE_PARAMS_FORMAT)
    : undefined;
  const dateToFilter = params.to
    ? moment(params.to).format(DEFAULT_DATE_PARAMS_FORMAT)
    : undefined;

  const filterQuery = createQueryString({
    approver: params.username,
    from: dateFromFilter,
    to: dateToFilter,
  });

  const res = await request.get<Blob>(
    `/api/reports/approval/download?${filterQuery}`,
    {
      responseType: 'blob',
    },
  );

  return res.data;
};
