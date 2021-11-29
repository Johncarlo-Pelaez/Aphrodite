import {
  getNomenclatureLookupsApi,
  CreateNomenclatureLookupApi,
  createNomenclatureLookupApi,
  UpdateNomenclatureLookupApi,
  updateNomenclatureLookupApi,
  deleteNomenclatureLookupApi,
} from 'apis';
import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
  useQueryClient,
} from 'react-query';
import { nomenclatureLookup } from 'models';
import { ApiError } from 'core/types';
import { QueryKey } from 'utils';

export const useNomenclatureLookups = (): UseQueryResult<
  nomenclatureLookup[],
  ApiError
> => {
  return useQuery(QueryKey.nomenclaturesLookups, getNomenclatureLookupsApi);
};

export const useCreateNomenclatureLookup = (): UseMutationResult<
  void,
  ApiError,
  CreateNomenclatureLookupApi
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, CreateNomenclatureLookupApi>(
    (data) => {
      return createNomenclatureLookupApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.nomenclaturesLookups);
      },
    },
  );
};

export const useUpdateNomenclatureLookup = (): UseMutationResult<
  void,
  ApiError,
  UpdateNomenclatureLookupApi
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, UpdateNomenclatureLookupApi>(
    (data) => {
      return updateNomenclatureLookupApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.nomenclaturesLookups);
      },
    },
  );
};

export const useDeleteNomenclatureLookup = (): UseMutationResult<
  void,
  ApiError,
  number
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, number>(
    (data) => {
      return deleteNomenclatureLookupApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.nomenclaturesLookups);
      },
    },
  );
};
