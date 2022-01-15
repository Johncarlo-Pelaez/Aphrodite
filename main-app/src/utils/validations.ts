import { AxiosError } from 'axios';
import { ErrorStatusCode } from 'core/enum';

export const checkIfUnAuthorize = (error: AxiosError): boolean => {
  return error.response?.status === ErrorStatusCode.UNAUTHORIZE;
};

export const checkIfConflict = (error: AxiosError): boolean => {
  return error.response?.status === ErrorStatusCode.CONFLICT;
};

export const checkIfForbidden = (error: AxiosError): boolean => {
  return error.response?.status === ErrorStatusCode.FORBIDDEN;
};
