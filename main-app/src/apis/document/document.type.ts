import { Document } from 'models';

export type GetDocsResult = {
  count: number;
  data: Document[];
};