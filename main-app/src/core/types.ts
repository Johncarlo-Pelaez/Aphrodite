import { ReactNode } from 'react';
import { AxiosError } from 'axios';

export type ApiError = AxiosError;
export type WithChildren<T = {}> = T & { children?: ReactNode };
