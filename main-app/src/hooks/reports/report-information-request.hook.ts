import {
  getDocumentReportApiInfoRequest,
  getDownloadDocumentReportInfoRequest,
  GetDocumentReportInfoRequestApiResponse,
  UseInfoRequest,
  UseDocumentReportInfoRequestFilterParams,
} from 'apis';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';
import { QueryKey } from 'utils';
import { ApiError } from 'core/types';

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
  UseDocumentReportInfoRequestFilterParams
> => {
  return useMutation<Blob, ApiError, UseDocumentReportInfoRequestFilterParams>(
    getDownloadDocumentReportInfoRequest,
    {
      onError: () => {},
    },
  );
};
