import { ParsedUrlQueryInput } from 'querystring';
import queryString, { ParseOptions } from 'query-string';

type TableQueryParams = {
  currentPage: number;
  pageSize: number;
};

type CalculatePageSkipParams = {
  currentPage: number;
  pageSize: number;
};

export const createTablePaginationQuery = (
  tableQuery: TableQueryParams,
): string => {
  const { currentPage, pageSize } = tableQuery;
  return createQueryString({
    take: pageSize,
    skip: calculatePageSkip({ currentPage, pageSize }),
  });
};

export const createQueryString = (
  params: ParsedUrlQueryInput,
  options?: ParseOptions,
): string => {
  const theOptions: ParseOptions = {
    arrayFormat: 'index',
    ...options,
  };
  return queryString.stringify(params, theOptions);
};

export const calculatePageSkip = (
  pageSkips: CalculatePageSkipParams,
): number => {
  const { currentPage, pageSize } = pageSkips;

  return (currentPage - 1) * pageSize;
};
