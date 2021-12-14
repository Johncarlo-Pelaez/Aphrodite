import {
  getDocumentReportApiUploaded,
  GetDocumentReportApiResponse,
  UseDocumentReport,
  DownloadDocumentReportUploadedParams,
  getDownloadDocumentReportUploaded,
  getDocumentReportApiInfoRequest,
  getDownloadDocumentReportInfoRequest,
} from 'apis';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';
import { QueryKey } from 'utils';
import { ApiError } from 'core/types';

export const useDocumentReportUploaded = (
  params: UseDocumentReport,
): UseQueryResult<GetDocumentReportApiResponse, ApiError> => {
  return useQuery(QueryKey.buildPaginatedActivityLogs(params), () =>
    getDocumentReportApiUploaded(params),
  );
};

export const useDownloadDocumentReportUploaded = (): UseMutationResult<
  Blob,
  ApiError,
  DownloadDocumentReportUploadedParams
> => {
  return useMutation<Blob, ApiError, DownloadDocumentReportUploadedParams>(
    getDownloadDocumentReportUploaded,
    {
      onError: () => {},
    },
  );
};

export const useDocumentReportInfoRequest = (
  params: UseDocumentReport,
): UseQueryResult<GetDocumentReportApiResponse, ApiError> => {
  return useQuery(QueryKey.buildPaginatedActivityLogs(params), () =>
    getDocumentReportApiInfoRequest(params),
  );
};

export const useDownloadDocumentReportInfoRequest = (): UseMutationResult<
  Blob,
  ApiError,
  DownloadDocumentReportUploadedParams
> => {
  return useMutation<Blob, ApiError, DownloadDocumentReportUploadedParams>(
    getDownloadDocumentReportInfoRequest,
    {
      onError: () => {},
    },
  );
};
