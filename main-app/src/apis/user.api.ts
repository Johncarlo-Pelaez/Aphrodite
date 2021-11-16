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

export interface UpdateUserApi {
  email: string;
  objectId: string;
  role: Role;
  firstname: string;
  lastname: string;
}

export interface UpdateUserIdentityApi extends UpdateUserApi {
  id: number;
}

export const updateUserApi = async ({
  id,
  email,
  objectId,
  role,
  firstname,
  lastname,
}: UpdateUserIdentityApi): Promise<void> => {
  await request.put(`/api/users/${id}`, {
    email,
    objectId,
    role,
    firstname,
    lastname,
  });
};
