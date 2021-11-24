import {
  getNomenclaturesApi,
  createNomenclatureApi,
  updateNomenclatureApi,
  deleteNomenclatureApi,
  CreateNomenclatureApi,
  UpdateNomenclatureApi,
} from 'apis';
import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
  useQueryClient,
} from 'react-query';
import { Nomenclature } from 'models';
import { ApiError } from 'core/types';
import { QueryKey } from 'utils';

export const useNomenclatures = (): UseQueryResult<
  Nomenclature[],
  ApiError
> => {
  return useQuery(QueryKey.nomenclatures, getNomenclaturesApi);
};

export const useCreateNomenclature = (): UseMutationResult<
  void,
  ApiError,
  CreateNomenclatureApi
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, CreateNomenclatureApi>(
    (data) => {
      return createNomenclatureApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.nomenclatures);
      },
    },
  );
};

export const useUpdateNomenclature = (): UseMutationResult<
  void,
  ApiError,
  UpdateNomenclatureApi
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, UpdateNomenclatureApi>(
    (data) => {
      return updateNomenclatureApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.nomenclatures);
      },
    },
  );
};

export const useDeleteNomenclature = (): UseMutationResult<
  void,
  ApiError,
  number
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, number>(
    (data) => {
      return deleteNomenclatureApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.nomenclatures);
      },
    },
  );
};
