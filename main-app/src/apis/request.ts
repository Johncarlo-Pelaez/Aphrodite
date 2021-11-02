import axios, {
  Canceler as AxiosCanceler,
  CancelTokenSource as AxiosCancelTokenSource,
} from 'axios';
import { API_BASE_URL } from 'core/constants';

export type Canceler = AxiosCanceler | null;
export type CancelTokenSource = AxiosCancelTokenSource | null;

export const request = axios.create({
  baseURL: API_BASE_URL,
});

export const createCancelTokenSource = (): CancelTokenSource => {
  return axios.CancelToken.source();
};

export const cancelRequest = (cancelTokenSource?: CancelTokenSource): void => {
  cancelTokenSource?.cancel();
};

export const isCanceled = (error: any): boolean => {
  return axios.isCancel(error);
};

export const setApiAuthorization = (token: string): void => {
  if (token) {
    request.defaults.headers['Authorization'] = 'Bearer ' + token;
  } else {
    request.defaults.headers['Authorization'] = undefined;
  }
};

export const getApiAuthorization = (): void => {
  return request.defaults.headers['Authorization'] ?? undefined;
};

export const setApiAccessToken = (token: string): void => {
  if (token) {
    request.defaults.headers['access-token'] = token;
  } else {
    request.defaults.headers['access-token'] = undefined;
  }
};

export const getApiAccessToken = (): void => {
  return request.defaults.headers['access-token'] ?? undefined;
};

export const removeApiHeaders = (): void => {
  setApiAuthorization('');
  setApiAccessToken('');
};
