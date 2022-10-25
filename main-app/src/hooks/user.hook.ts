import {
  getUsersApi,
  checkIsRootUserExistsApi,
  createRootUserApi,
  CreateRootUserApi,
  createUserApi,
  checkEmailExistsApi,
  CreateUserApi,
  UpdateUserApi,
  updateUserApi,
  getCurrentUser,
  deleteUserApi,
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
import { useAccountToActivate, useEmailAllowed, useLoadAccountToken} from 'hooks/account.hook';
import { ApiError } from 'core/types';
import { useState } from 'react';
import { QueryKey, checkIfUnAuthorize } from 'utils';
import { useMsal } from '@azure/msal-react';
import { scopes } from 'authConfig';

export const useUsers = (): UseQueryResult<User[], ApiError> => {
  return useQuery(QueryKey.users, getUsersApi);
};

export const useRootUserExists = (): UseQueryResult<boolean, ApiError> => {
  return useQuery<boolean, ApiError>(QueryKey.root, checkIsRootUserExistsApi);
};

export const useCreateRootUser = (): UseMutationResult<
  void,
  ApiError,
  CreateRootUserApi
> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, CreateRootUserApi>(
    (data) => {
      return createRootUserApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.users);
      },
    },
  );
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
  const {instance} = useMsal();
  const setIsLoaded = useSetRecoilState(isAccountTokenLoadedState);
  const { isAllowed } = useEmailAllowed();
  const isLoaded = useAccountToActivate();
  return useQuery<User, ApiError>(QueryKey.currentUser, getCurrentUser, {
    refetchInterval: 1000 * 30,
    enabled: isAllowed && isLoaded,
    onError: async (error) => {
      if (checkIfUnAuthorize(error)) {
        instance.loginRedirect({scopes: scopes})
        // removeApiHeaders();
        // setIsLoaded(false);
      }
    },
  });
};

export const useDeleteUser = (): UseMutationResult<void, ApiError, number> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, number>(
    (data) => {
      return deleteUserApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.users);
      },
    },
  );
};
