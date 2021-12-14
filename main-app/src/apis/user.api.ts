import { request } from './request';
import { User } from 'models';
import { Role } from 'core/enum';
import { createQueryString } from 'utils/query-string';

export const getCurrentUser = async (): Promise<User> => {
  const res = await request.get<User>('/api/users/current');
  return res.data;
};

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
  firstName: string;
  lastName: string;
  objectId: string;
  role: Role;
}

export const createUserApi = async (params: CreateUserApi): Promise<void> => {
  await request.post('/api/users/create', params);
};

export interface UpdateUserApiParams {
  role: Role;
  firstname: string;
  lastname: string;
  isActive?: boolean;
}

export interface UpdateUserApi extends UpdateUserApiParams {
  id: number;
}

export const updateUserApi = async ({
  id,
  ...rest
}: UpdateUserApi): Promise<void> => {
  await request.put(`/api/users/${id}`, rest);
};

export const deleteUserApi = async (id: number): Promise<void> => {
  await request.delete(`/api/users/${id}`);
};
