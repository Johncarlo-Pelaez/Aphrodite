import { request } from './request';
import { nomenclatureLookup } from 'models';

export const getNomenclatureLookupsApi = async (): Promise<
  nomenclatureLookup[]
> => {
  const res = await request.get<nomenclatureLookup[]>(
    '/api/nomenclatures/lookups',
  );
  return res.data;
};

export interface CreateNomenclatureLookupApi {
  nomenclature: string;
  documentGroup: string;
}

export const createNomenclatureLookupApi = async (
  params: CreateNomenclatureLookupApi,
): Promise<void> => {
  await request.post('/api/nomenclatures/lookups', params);
};

export interface UpdateNomenclatureLookupApi
  extends CreateNomenclatureLookupApi {
  id: number;
}

export const updateNomenclatureLookupApi = async ({
  id,
  ...rest
}: UpdateNomenclatureLookupApi): Promise<void> => {
  await request.put(`/api/nomenclatures/lookups/${id}`, rest);
};

export const deleteNomenclatureLookupApi = async (
  id: number,
): Promise<void> => {
  await request.delete(`/api/nomenclatures/lookups/${id}`);
};
