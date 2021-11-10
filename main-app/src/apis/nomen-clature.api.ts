import { request } from './request';
import { NomenClature } from 'models';

export const getNomenClaturesApi = async (): Promise<NomenClature[]> => {
  const res = await request.get<NomenClature[]>('/api/nomen-clature');
  return res.data;
};

export interface CreateNomenClatureApi {
  description: string;
}

export const createNomenClatureApi = async (
  params: CreateNomenClatureApi,
): Promise<void> => {
  await request.post('/api/nomen-clature', params);
};

export interface UpdateNomenClatureApi {
  id: number;
  description: string;
}

export const updateNomenClatureApi = async ({
  id,
  description,
}: UpdateNomenClatureApi): Promise<void> => {
  await request.put(`/api/nomen-clature/${id}`, { description });
};

export const deleteNomenClatureApi = async (id: number): Promise<void> => {
  await request.delete(`/api/nomen-clature/${id}`);
};
