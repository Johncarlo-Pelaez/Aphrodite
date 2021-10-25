import moment from 'moment';

export const sortText =
  <T extends Record<string, any> = {}>(key: string) =>
  (a: T, b: T) =>
    a[key].toString().localeCompare(b[key]);
export const sortInteger =
  <T extends Record<string, any> = {}>(key: string) =>
  (a: T, b: T) =>
    a[key] - b[key];
export const sortDateTime =
  <T extends Record<string, any> = {}>(key: string) =>
  (a: T, b: T) =>
    moment(a[key]).unix() - moment(b[key]).unix();
