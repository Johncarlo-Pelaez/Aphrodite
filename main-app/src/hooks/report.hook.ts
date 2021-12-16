import {
  getDocumentReportApiUploaded,
  GetDocumentReportApiResponse,
  UseDocumentReport,
  DownloadDocumentReportUploadedParams,
  getDownloadDocumentReportUploaded,
} from 'apis';
import {
  getDocumentReportApiInfoRequest,
  getDownloadDocumentReportInfoRequest,
  GetDocumentReportInfoRequestApiResponse,
  UseInfoRequest,
  DownloadReportInfoRequestParams,
} from 'apis';
import {
  UseDocumentReportQC,
  GetDocumentReportQCApiResponse,
  getReportQCApi,
} from 'apis';
import {
  UseReportApproval,
  GetReportApprovalApiResponse,
  getReportApprovalApi,
} from 'apis';
import {
  UseReportImport,
  GetReportImportApiResponse,
  getReportImportApi,
} from 'apis';

import {
  GetReportRISApiResponse,
  getDownloadReportRIS,
  UseReportRIS,
  geReportRISApi,
  DownloadReportRISParams,
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
  DownloadReportInfoRequestParams
> => {
  return useMutation<Blob, ApiError, DownloadReportInfoRequestParams>(
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
    getReportQCApi(params),
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

export const useReportRIS = (
  params: UseReportRIS,
): UseQueryResult<GetReportRISApiResponse, ApiError> => {
  return useQuery(QueryKey.buildPaginatedReportRIS(params), () =>
    geReportRISApi(params),
  );
};

export const useDownloadReportRIS = (): UseMutationResult<
  Blob,
  ApiError,
  DownloadReportRISParams
> => {
  return useMutation<Blob, ApiError, DownloadReportRISParams>(
    getDownloadReportRIS,
    {
      onError: () => {},
    },
  );
};
