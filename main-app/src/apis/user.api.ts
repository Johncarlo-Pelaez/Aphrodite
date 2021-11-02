import { request } from './request';
import { Role, User } from 'models';
import { createQueryString } from 'utils/query-string';

export const getUsersApi = async (): Promise<User[]> => {
  const res = await request.get<User[]>('/api/users');
  return res.data;
};

export const checkEmailExistsApi = async (email: string): Promise<boolean> => {
  const filterQuery = createQueryString({
    email,
  });
  const res = await request.get<boolean>(
    `/api/users/email-exist?${filterQuery}`,
  );
  return res.data;
};

export interface CreateUserApi {
  email: string;
  objectId: string;
  role: Role;
}

export const createUserApi = async (params: CreateUserApi): Promise<void> => {
  await request.post('/api/users/create', params);
};
