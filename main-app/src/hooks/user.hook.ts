import {
  getUsersApi,
  createUserApi,
  checkEmailExistsApi,
  CreateUserApi,
  UpdateUserApi,
  updateUserApi,
  getCurrentUser,
  removeApiHeaders,
} from 'apis';
import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
  useQueryClient,
} from 'react-query';
import { useSetRecoilState } from 'recoil';
import { isAccountTokenLoadedState } from 'states';
import { User } from 'models';
import { useEmailAllowed, useLoadAccountToken } from 'hooks/account.hook';
import { ApiError } from 'core/types';
import { useState } from 'react';
import { QueryKey, checkIfUnAuthorize } from 'utils';

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
  UpdateUserApi
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, UpdateUserApi>(
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

export const useGetCurrentUser = (): UseQueryResult<User, ApiError> => {
  const setIsLoaded = useSetRecoilState(isAccountTokenLoadedState);
  const { isAllowed } = useEmailAllowed();
  const { isLoaded } = useLoadAccountToken();
  return useQuery<User, ApiError>(QueryKey.currentUser, getCurrentUser, {
    refetchInterval: 1000 * 30,
    enabled: isAllowed && isLoaded,
    onError: (error) => {
      if (checkIfUnAuthorize(error)) {
        removeApiHeaders();
        setIsLoaded(false);
      }
    },
  });
};
