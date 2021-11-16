import {
  getUsersApi,
  createUserApi,
  checkEmailExistsApi,
  CreateUserApi,
  UpdateUserIdentityApi,
  updateUserApi,
} from 'apis';
import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
  useQueryClient,
} from 'react-query';
import { User } from 'models';
import { ApiError } from 'core/types';
import { useState } from 'react';
import { QueryKey } from 'utils';

export const useUsers = (): UseQueryResult<User[], ApiError> => {
  return useQuery(QueryKey.users, getUsersApi);
};

export const useCreateUser = (): UseMutationResult<
  void,
  ApiError,
  CreateUserApi
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, CreateUserApi>(
    (data) => {
      return createUserApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.users);
      },
    },
  );
};

export const useUpdateUser = (): UseMutationResult<
  void,
  ApiError,
  UpdateUserIdentityApi
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, UpdateUserIdentityApi>(
    (data) => {
      return updateUserApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.users);
      },
    },
  );
};

export type UseEmailExistsResult = {
  isLoading: boolean;
  checkEmailExists: (email: string) => Promise<boolean>;
};

export const useEmailExists = (): UseEmailExistsResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkEmailExists = async (email: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const exists = await checkEmailExistsApi(email);
      return exists;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, checkEmailExists };
};
