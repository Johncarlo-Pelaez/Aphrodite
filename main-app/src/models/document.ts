import { User } from './user';

export type Document = {
  id: number;
  documentName: string;
  documentSize: number;
  modifiedDate: string;
  description: string;
  user: User;
};  