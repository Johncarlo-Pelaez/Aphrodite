import {
  getNomenClaturesApi,
  createNomenClatureApi,
  updateNomenClatureApi,
  deleteNomenClatureApi,
  CreateNomenClatureApi,
  UpdateNomenClatureApi,
} from 'apis';
import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
  useQueryClient,
} from 'react-query';
import { NomenClature } from 'models';
import { ApiError } from 'core/types';
import { QueryKey } from 'utils';

export const useNomenClatures = (): UseQueryResult<
  NomenClature[],
  ApiError
> => {
  return useQuery(QueryKey.nomenClatures, getNomenClaturesApi);
};

export const useCreateNomenClature = (): UseMutationResult<
  void,
  ApiError,
  CreateNomenClatureApi
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, CreateNomenClatureApi>(
    (data) => {
      return createNomenClatureApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.nomenClatures);
      },
    },
  );
};

export const useUpdateNomenClature = (): UseMutationResult<
  void,
  ApiError,
  UpdateNomenClatureApi
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, UpdateNomenClatureApi>(
    (data) => {
      return updateNomenClatureApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.nomenClatures);
      },
    },
  );
};

export const useDeleteNomenClature = (): UseMutationResult<
  void,
  ApiError,
  number
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, number>(
    (data) => {
      return deleteNomenClatureApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.nomenClatures);
      },
    },
  );
};
