import { request } from '../request';
import { GetDocsResult } from './document.type'

export { getDocuments };

const getDocuments = async (query?: string): Promise<GetDocsResult> => {
  const res = await request.get<GetDocsResult>(`/api/documents?${query}`);
  return res.data;
};
  