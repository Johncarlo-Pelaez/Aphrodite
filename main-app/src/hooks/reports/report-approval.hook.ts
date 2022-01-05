import {
  UseReportApproval,
  GetReportApprovalApiResponse,
  getReportApprovalApi,
  UseReportApprovalFilterParams,
  getDownloadDocumentReportApproval,
} from 'apis';

import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from 'react-query';
import { QueryKey } from 'utils';
import { ApiError } from 'core/types';

export const useReportApproval = (
  params: UseReportApproval,
): UseQueryResult<GetReportApprovalApiResponse, ApiError> => {
  return useQuery(QueryKey.buildPaginatedReportApproval(params), () =>
    getReportApprovalApi(params),
  );
};

export const useDownloadReportApproval = (): UseMutationResult<
  Blob,
  ApiError,
  UseReportApprovalFilterParams
> => {
  return useMutation<Blob, ApiError, UseReportApprovalFilterParams>(
    getDownloadDocumentReportApproval,
    {
      onError: () => {},
    },
  );
};
