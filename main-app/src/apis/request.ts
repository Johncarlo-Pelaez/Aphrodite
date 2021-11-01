import axios, {
  Canceler as AxiosCanceler,
  CancelTokenSource as AxiosCancelTokenSource,
} from 'axios';
import { API_BASE_URL } from 'core/constants';

export {
  request,
  createCancelTokenSource,
  cancelRequest,
  isCanceled,
  setApiAuthorization,
  removeApiAuthorization,
};

export type Canceler = AxiosCanceler | null;
export type CancelTokenSource = AxiosCancelTokenSource | null;

const request = axios.create({
  baseURL: API_BASE_URL,
});

const createCancelTokenSource = (): CancelTokenSource => {
  return axios.CancelToken.source();
};

const cancelRequest = (cancelTokenSource?: CancelTokenSource): void => {
  cancelTokenSource?.cancel();
};

const isCanceled = (error: any): boolean => {
  return axios.isCancel(error);
};

const setApiAuthorization = (token: string): void => {
  if (token) {
    request.defaults.headers['Authorization'] = 'Bearer ' + token;
  } else {
    request.defaults.headers['Authorization'] = undefined;
  }
};

const removeApiAuthorization = (): void => {
  setApiAuthorization('');
};
