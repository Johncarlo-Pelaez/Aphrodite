import { request } from './request';
import { Role, User } from 'models';
import { createQueryString } from 'utils/query-string';

export {
  getUsersApi,
  checkEmailExistsApi,
  createEncoderUserApi,
  createReviewerUserApi,
};

const getUsersApi = async (): Promise<User[]> => {
  const res = await request.get<User[]>('/api/users');
  return res.data;
};

const checkEmailExistsApi = async (email: string): Promise<boolean> => {
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
  role: Role;
}

export interface CreateEncoderUserApi extends CreateUserApi {}

const createEncoderUserApi = async (
  params: CreateEncoderUserApi,
): Promise<void> => {
  await request.post('/api/users/encoder', params);
};

export interface CreateReviewerUserApi extends CreateUserApi {}

const createReviewerUserApi = async (
  params: CreateReviewerUserApi,
): Promise<void> => {
  await request.post('/api/users/reviewer', params);
};
