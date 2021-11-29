import {
  getNomenclaturesWhitelistApi,
  createNomenclatureWhitelistApi,
  updateNomenclatureWhitelistApi,
  deleteNomenclatureWhitelistApi,
  CreateNomenclatureWhitelistApi,
  UpdateNomenclatureWhitelistApi,
} from 'apis';
import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
  useQueryClient,
} from 'react-query';
import { NomenclatureWhitelist } from 'models';
import { ApiError } from 'core/types';
import { QueryKey } from 'utils';

export const useNomenclaturesWhitelist = (): UseQueryResult<
  NomenclatureWhitelist[],
  ApiError
> => {
  return useQuery(
    QueryKey.nomenclaturesWhitelist,
    getNomenclaturesWhitelistApi,
  );
};

export const useCreateNomenclatureWhitelist = (): UseMutationResult<
  void,
  ApiError,
  CreateNomenclatureWhitelistApi
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, CreateNomenclatureWhitelistApi>(
    (data) => {
      return createNomenclatureWhitelistApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.nomenclaturesWhitelist);
      },
    },
  );
};

export const useUpdateNomenclatureWhitelist = (): UseMutationResult<
  void,
  ApiError,
  UpdateNomenclatureWhitelistApi
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, UpdateNomenclatureWhitelistApi>(
    (data) => {
      return updateNomenclatureWhitelistApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.nomenclaturesWhitelist);
      },
    },
  );
};

export const useDeleteNomenclatureWhitelist = (): UseMutationResult<
  void,
  ApiError,
  number
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, number>(
    (data) => {
      return deleteNomenclatureWhitelistApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.nomenclaturesWhitelist);
      },
    },
  );
};
