import axios from 'axios';
import { API_BASE_URL } from 'core/constants';
import { CancelTokenSource } from './request.types';

export { request, createCancelTokenSource, cancelRequest, isCanceled };

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
}