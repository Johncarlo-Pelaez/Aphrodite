import { request } from '../request';
import { User } from 'models';
import { CreateUserParams } from './user.types';

export { getUsers, createEncoderUser, createReviewerUser, getIsUserEmailExist };

const getUsers = async (): Promise<User[]> => {
  const res = await request.get<User[]>('/api/users');
  return res.data;
};

const createEncoderUser = async (params: CreateUserParams): Promise<void> => {
  await request.post('/api/users/encoder', params);
};

const createReviewerUser = async (params: CreateUserParams): Promise<void> => {
  await request.post('/api/users/reviewer', params);
};

const getIsUserEmailExist = async (query?: string): Promise<boolean> => {
  const res = await request.get<boolean>(`/api/users/email-exist?${query}`);
  return res.data;
};