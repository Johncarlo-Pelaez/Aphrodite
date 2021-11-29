import { request } from './request';
import { NomenclatureWhitelist } from 'models';

export const getNomenclaturesWhitelistApi = async (): Promise<
  NomenclatureWhitelist[]
> => {
  const res = await request.get<NomenclatureWhitelist[]>(
    '/api/nomenclatures/whitelist',
  );
  return res.data;
};

export interface CreateNomenclatureWhitelistApi {
  description: string;
}

export const createNomenclatureWhitelistApi = async (
  params: CreateNomenclatureWhitelistApi,
): Promise<void> => {
  await request.post('/api/nomenclatures/whitelist', params);
};

export interface UpdateNomenclatureWhitelistApi
  extends CreateNomenclatureWhitelistApi {
  id: number;
}

export const updateNomenclatureWhitelistApi = async ({
  id,
  ...rest
}: UpdateNomenclatureWhitelistApi): Promise<void> => {
  await request.put(`/api/nomenclatures/whitelist/${id}`, rest);
};

export const deleteNomenclatureWhitelistApi = async (
  id: number,
): Promise<void> => {
  await request.delete(`/api/nomenclatures/whitelist/${id}`);
};
