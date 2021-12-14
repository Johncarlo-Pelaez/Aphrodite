import {
  getDocumentReportApiUploaded,
  GetDocumentReportApiResponse,
  UseDocumentReport,
  DownloadDocumentReportUploadedParams,
  getDownloadDocumentReportUploaded,
  getDocumentReportApiInfoRequest,
  getDownloadDocumentReportInfoRequest,
  GetDocumentReportInfoRequestApiResponse,
  UseInfoRequest,
  UseDocumentReportQC,
  GetDocumentReportQCApiResponse,
  getReportQCApiInfoRequest,
  UseReportApproval,
  GetReportApprovalApiResponse,
  getReportApprovalApi,
  UseReportImport,
  GetReportImportApiResponse,
  getReportImportApi,
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
  return useQuery(QueryKey.buildPaginatedDocumentReportUploaded(params), () =>
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
  params: UseInfoRequest,
): UseQueryResult<GetDocumentReportInfoRequestApiResponse, ApiError> => {
  return useQuery(QueryKey.builPaginatedReportInformationRequest(params), () =>
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

export const useDocumentReportQC = (
  params: UseDocumentReportQC,
): UseQueryResult<GetDocumentReportQCApiResponse, ApiError> => {
  return useQuery(QueryKey.buildPaginatedReportQualityChecked(params), () =>
    getReportQCApiInfoRequest(params),
  );
};

export const useReportApproval = (
  params: UseReportApproval,
): UseQueryResult<GetReportApprovalApiResponse, ApiError> => {
  return useQuery(QueryKey.buildPaginatedReportApproval(params), () =>
    getReportApprovalApi(params),
  );
};

export const useReportImport = (
  params: UseReportImport,
): UseQueryResult<GetReportImportApiResponse, ApiError> => {
  return useQuery(QueryKey.buildPaginatedReportImport(params), () =>
    getReportImportApi(params),
  );
};
