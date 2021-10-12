import { ParsedUrlQueryInput } from 'querystring';
import queryString, { ParseOptions } from 'query-string';

export { createTablePaginationQuery, createQueryString };

type TableQueryParams = {
  currentPage: number;
  pageSize: number;
};

type CalculatePageSkipParams = {
  currentPage: number;
  pageSize: number;
};

const createTablePaginationQuery = (tableQuery: TableQueryParams): string => {
  const { currentPage, pageSize } = tableQuery;
  return createQueryString({
    take: pageSize,
    skip: calculatePageSkip({ currentPage, pageSize }),
  });
};

const createQueryString = (
  params: ParsedUrlQueryInput,
  options?: ParseOptions
): string => {
  return queryString.stringify(params, options);
};

const calculatePageSkip = (pageSkips: CalculatePageSkipParams): number => {
  const { currentPage, pageSize } = pageSkips;

  return (currentPage - 1) * pageSize;
};
