import { request } from './request';
import {
  DocumentReport,
  InformationRequestReport,
  QualityCheckReport,
  ApprovalReport,
  ImportReport,
} from 'models';
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

export const getDocumentReportApiUploaded = async (
  params: UseDocumentReport,
): Promise<GetDocumentReportApiResponse> => {
  const paginationQuery = createTablePaginationQuery({
    currentPage: params.currentPage,
    pageSize: params.pageSize,
  });

  const dateFromFilter = params.from
    ? moment(params.from).startOf('day').format(DEFAULT_DATE_FORMAT)
    : undefined;
  const dateToFilter = params.to
    ? moment(params.to).endOf('day').format(DEFAULT_DATE_FORMAT)
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
    ? moment(params.from).startOf('day').format(DEFAULT_DATE_FORMAT)
    : undefined;
  const dateToFilter = params.to
    ? moment(params.to).endOf('day').format(DEFAULT_DATE_FORMAT)
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

export const getDocumentReportApiInfoRequest = async (
  params: UseInfoRequest,
): Promise<GetDocumentReportInfoRequestApiResponse> => {
  const paginationQuery = createTablePaginationQuery({
    currentPage: params.currentPage,
    pageSize: params.pageSize,
  });

  const dateFromFilter = params.from
    ? moment(params.from).startOf('day').format(DEFAULT_DATE_FORMAT)
    : undefined;
  const dateToFilter = params.to
    ? moment(params.to).endOf('day').format(DEFAULT_DATE_FORMAT)
    : undefined;

  const filterQuery = createQueryString({
    uploader: params.username,
    from: dateFromFilter,
    to: dateToFilter,
  });

  const res = await request.get<GetDocumentReportInfoRequestApiResponse>(
    `/api/reports/information-request?${paginationQuery}&${filterQuery}`,
  );
  return res.data;
};

export type DownloadReportInfoRequestUploadedParams = UseInfoRequest;

export const getDownloadDocumentReportInfoRequest = async (
  params: DownloadReportInfoRequestUploadedParams,
): Promise<Blob> => {
  const paginationQuery = createTablePaginationQuery(params);

  const dateFromFilter = params.from
    ? moment(params.from).startOf('day').format(DEFAULT_DATE_FORMAT)
    : undefined;
  const dateToFilter = params.to
    ? moment(params.to).endOf('day').format(DEFAULT_DATE_FORMAT)
    : undefined;

  const filterQuery = createQueryString({
    uploader: params.username,
    from: dateFromFilter,
    to: dateToFilter,
  });

  const res = await request.get<Blob>(
    `/api/reports/information-request/download?${paginationQuery}&${filterQuery}`,
    {
      responseType: 'blob',
    },
  );

  return res.data;
};

export const getReportQCApiInfoRequest = async (
  params: UseDocumentReportQC,
): Promise<GetDocumentReportQCApiResponse> => {
  const paginationQuery = createTablePaginationQuery({
    currentPage: params.currentPage,
    pageSize: params.pageSize,
  });

  const dateFromFilter = params.from
    ? moment(params.from).startOf('day').format(DEFAULT_DATE_FORMAT)
    : undefined;
  const dateToFilter = params.to
    ? moment(params.to).endOf('day').format(DEFAULT_DATE_FORMAT)
    : undefined;

  const filterQuery = createQueryString({
    uploader: params.username,
    from: dateFromFilter,
    to: dateToFilter,
  });

  const res = await request.get<GetDocumentReportQCApiResponse>(
    `/api/reports/quality-check?${paginationQuery}&${filterQuery}`,
  );
  return res.data;
};

export type DownloadReportQCUploadedParams = UseInfoRequest;

export const getDownloadQCReportInfoRequest = async (
  params: DownloadReportQCUploadedParams,
): Promise<Blob> => {
  const paginationQuery = createTablePaginationQuery(params);

  const dateFromFilter = params.from
    ? moment(params.from).startOf('day').format(DEFAULT_DATE_FORMAT)
    : undefined;
  const dateToFilter = params.to
    ? moment(params.to).endOf('day').format(DEFAULT_DATE_FORMAT)
    : undefined;

  const filterQuery = createQueryString({
    uploader: params.username,
    from: dateFromFilter,
    to: dateToFilter,
  });

  const res = await request.get<Blob>(
    `/api/reports/quality-check/download?${paginationQuery}&${filterQuery}`,
    {
      responseType: 'blob',
    },
  );

  return res.data;
};

export const getReportApprovalApi = async (
  params: UseReportApproval,
): Promise<GetReportApprovalApiResponse> => {
  const paginationQuery = createTablePaginationQuery({
    currentPage: params.currentPage,
    pageSize: params.pageSize,
  });

  const dateFromFilter = params.from
    ? moment(params.from).startOf('day').format(DEFAULT_DATE_FORMAT)
    : undefined;
  const dateToFilter = params.to
    ? moment(params.to).endOf('day').format(DEFAULT_DATE_FORMAT)
    : undefined;

  const filterQuery = createQueryString({
    uploader: params.username,
    from: dateFromFilter,
    to: dateToFilter,
  });

  const res = await request.get<GetReportApprovalApiResponse>(
    `/api/reports/approval?${paginationQuery}&${filterQuery}`,
  );
  return res.data;
};

export const getReportImportApi = async (
  params: UseReportImport,
): Promise<GetReportImportApiResponse> => {
  const paginationQuery = createTablePaginationQuery({
    currentPage: params.currentPage,
    pageSize: params.pageSize,
  });

  const dateFromFilter = params.from
    ? moment(params.from).startOf('day').format(DEFAULT_DATE_FORMAT)
    : undefined;
  const dateToFilter = params.to
    ? moment(params.to).endOf('day').format(DEFAULT_DATE_FORMAT)
    : undefined;

  const filterQuery = createQueryString({
    uploader: params.username,
    from: dateFromFilter,
    to: dateToFilter,
  });

  const res = await request.get<GetReportImportApiResponse>(
    `/api/reports/import?${paginationQuery}&${filterQuery}`,
  );
  return res.data;
};

// export type DownloadReportQCUploadedParams = UseInfoRequest;

// export const getDownloadQCReportInfoRequest = async (
//   params: DownloadReportQCUploadedParams,
// ): Promise<Blob> => {
//   const paginationQuery = createTablePaginationQuery(params);

//   const dateFromFilter = params.from
//     ? moment(params.from).startOf('day').format(DEFAULT_DATE_FORMAT)
//     : undefined;
//   const dateToFilter = params.to
//     ? moment(params.to).endOf('day').format(DEFAULT_DATE_FORMAT)
//     : undefined;

//   const filterQuery = createQueryString({
//     uploader: params.username,
//     from: dateFromFilter,
//     to: dateToFilter,
//   });

//   const res = await request.get<Blob>(
//     `/api/reports/quality-check/download?${paginationQuery}&${filterQuery}`,
//     {
//       responseType: 'blob',
//     },
//   );

//   return res.data;
// };
