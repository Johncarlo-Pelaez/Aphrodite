import {
  getDocumentReportApiUploaded,
  GetDocumentReportApiResponse,
  UseDocumentReport,
  DownloadDocumentReportUploadedParams,
  getDownloadDocumentReportUploaded,
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
