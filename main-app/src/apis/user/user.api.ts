import { request } from '../request';
import { User } from 'models';

export { getUsers };

const getUsers = async (): Promise<User[]> => {
  const res = await request.get<User[]>('/api/users');
  return res.data;
};
