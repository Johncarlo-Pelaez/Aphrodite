import {
  getUsers,
  createEncoderUser,
  createReviewerUser,
  CreateUserParams,
} from 'apis/user';
import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
  useQueryClient,
} from 'react-query';
import { User } from 'models';
import { QueryCacheKey, Role } from 'core/enums';
import { ApiError } from 'core/types';

export { useUsers, useAddUser };

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
