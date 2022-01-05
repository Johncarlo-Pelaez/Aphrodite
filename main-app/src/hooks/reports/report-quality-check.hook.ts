import {
  UseDocumentReportQC,
  GetDocumentReportQCApiResponse,
  getReportQCApi,
  getDownloadQualityCheck,
  UseDocumentReportQCFilterParams,
} from 'apis';

import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';
import { QueryKey } from 'utils';
import { ApiError } from 'core/types';

export const useDocumentReportQC = (
  params: UseDocumentReportQC,
): UseQueryResult<GetDocumentReportQCApiResponse, ApiError> => {
  return useQuery(QueryKey.buildPaginatedReportQualityChecked(params), () =>
    getReportQCApi(params),
  );
};

export const useDownloadQualityCheck = (): UseMutationResult<
  Blob,
  ApiError,
  UseDocumentReportQCFilterParams
> => {
  return useMutation<Blob, ApiError, UseDocumentReportQCFilterParams>(
    getDownloadQualityCheck,
    {
      onError: () => {},
    },
  );
};
