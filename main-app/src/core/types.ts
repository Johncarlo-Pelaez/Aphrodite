import { ReactNode } from 'react';
import { AxiosError } from 'axios';

export type ApiError = AxiosError;
export type WithChildren<T = {}> = T & { children?: ReactNode };
export type MenuItem = {
  path: string;
  label: string;
  icon?: ReactNode;
  subItems?: MenuItem[];
  hidden?: boolean;
};
