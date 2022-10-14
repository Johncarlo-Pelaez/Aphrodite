import { request } from './request';
import { User } from 'models';
import { Role } from 'core/enum';
import { createQueryString } from 'utils/query-string';

// Request Get Email Current User Logged In
export const getCurrentUser = async (): Promise<User> => {
  const res = await request.get<User>('/api/users/current');
  return res.data;
};

// Request Get Users
export const getUsersApi = async (): Promise<User[]> => {
  const res = await request.get<User[]>('/api/users');
  return res.data;
};

// Request Check Email if already exist
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

// Request Create User
export const createUserApi = async (params: CreateUserApi): Promise<void> => {
  await request.post('/api/users/create', params);
};

export interface CreateRootUserApi {
  email: string;
  firstName: string;
  lastName: string;
  objectId: string;
}

// Request Create Root User
export const createRootUserApi = async (
  params: CreateRootUserApi,
): Promise<void> => {
  await request.post('/api/users/root', params);
};

// Request Check if Root User is already exist
export const checkIsRootUserExistsApi = async (): Promise<boolean> => {
  const res = await request.get<boolean>('/api/users/is-root-exist');
  return res.data;
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

// Request Update User
export const updateUserApi = async ({
  id,
  ...rest
}: UpdateUserApi): Promise<void> => {
  await request.put(`/api/users/${id}`, rest);
};

// Request Delete User
export const deleteUserApi = async (id: number): Promise<void> => {
  await request.delete(`/api/users/${id}`);
};
