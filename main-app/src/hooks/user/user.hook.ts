import { getUsers } from 'apis/user';
import { User } from 'models';
import { useQuery, UseQueryResult } from 'react-query';
import { QueryCacheKey } from 'core/enums';

export { useUsers };

const useUsers = (): UseQueryResult<User[]> => {
  return useQuery<User[]>([QueryCacheKey.USERS], getUsers);
};
