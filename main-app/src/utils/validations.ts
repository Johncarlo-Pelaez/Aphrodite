import { AxiosError } from 'axios';
import { ErrorStatusCode } from 'core/enum';

export const checkIfUnAuthorize = (error: AxiosError): boolean => {
  return error.response?.status === ErrorStatusCode.UNAUTHORIZE;
};
