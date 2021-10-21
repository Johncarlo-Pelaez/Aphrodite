import {
  getUsers,
  createEncoderUser,
  createReviewerUser,
  CreateUserParams,
  getIsUserEmailExist,
} from 'apis/user';
import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
  useQueryClient,
} from 'react-query';
import { createQueryString } from 'utils/query-string';
import { User } from 'models';
import { QueryCacheKey, Role } from 'core/enums';
import { ApiError } from 'core/types';

export { useUsers, useAddUser, useIsUserEmailExist };

const useUsers = (): UseQueryResult<User[]> => {
  return useQuery<User[]>([QueryCacheKey.USERS], getUsers);
};

type UseAddUserParams = {
  role: Role;
};

const useAddUser = ({
  role,
}: UseAddUserParams): UseMutationResult<void, ApiError, CreateUserParams> => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, CreateUserParams>(
    role === Role.ENCODER ? createEncoderUser : createReviewerUser,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryCacheKey.USERS);
      },
    },
  );
};

const useIsUserEmailExist = (email: string): UseQueryResult<boolean> => {
  const queryClient = useQueryClient();
  const filterQuery = createQueryString(
    {
      email,
    },
    { arrayFormat: 'index' },
  );
  return useQuery<boolean>(
    [QueryCacheKey.USERS, email],
    () => getIsUserEmailExist(filterQuery),
    {
      placeholderData: () => {
        return !!queryClient
          .getQueryData<User[]>(QueryCacheKey.USERS)
          ?.find((user) => user.email === email);
      },
    },
  );
};
