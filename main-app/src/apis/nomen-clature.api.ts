import { request } from './request';
import { Nomenclature } from 'models';

export const getNomenclaturesApi = async (): Promise<Nomenclature[]> => {
  const res = await request.get<Nomenclature[]>('/api/nomenclatures');
  return res.data;
};

export interface CreateNomenclatureApi {
  description: string;
}

export const createNomenclatureApi = async (
  params: CreateNomenclatureApi,
): Promise<void> => {
  await request.post('/api/nomenclatures', params);
};

export interface UpdateNomenclatureApi extends CreateNomenclatureApi {
  id: number;
}

export const updateNomenclatureApi = async ({
  id,
  description,
}: UpdateNomenclatureApi): Promise<void> => {
  await request.put(`/api/nomenclatures/${id}`, { description });
};

export const deleteNomenclatureApi = async (id: number): Promise<void> => {
  await request.delete(`/api/nomenclatures/${id}`);
};
