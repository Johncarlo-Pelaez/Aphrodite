import { request } from './request';
import { Lookup } from 'models';

export const getLookupsApi = async (): Promise<Lookup[]> => {
  const res = await request.get<Lookup[]>('/api/lookups');
  return res.data;
};
