import { request } from './request';
import { NomenclatureWhitelist } from 'models';

// Request Nomenclature Whitelists
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

// Request Create Nomenclature Whitelist
export const createNomenclatureWhitelistApi = async (
  params: CreateNomenclatureWhitelistApi,
): Promise<void> => {
  await request.post('/api/nomenclatures/whitelist', params);
};

export interface UpdateNomenclatureWhitelistApi
  extends CreateNomenclatureWhitelistApi {
  id: number;
}

// Request Update Nomenclature Whitelist
export const updateNomenclatureWhitelistApi = async ({
  id,
  ...rest
}: UpdateNomenclatureWhitelistApi): Promise<void> => {
  await request.put(`/api/nomenclatures/whitelist/${id}`, rest);
};

// Request Delete Nomenclature Whitelist
export const deleteNomenclatureWhitelistApi = async (
  id: number,
): Promise<void> => {
  await request.delete(`/api/nomenclatures/whitelist/${id}`);
};
