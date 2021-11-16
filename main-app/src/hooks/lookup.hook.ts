import { getLookupsApi } from 'apis';
import { useQuery, UseQueryResult } from 'react-query';
import { Lookup } from 'models';
import { ApiError } from 'core/types';
import { QueryKey } from 'utils';

export const useLookups = (): UseQueryResult<Lookup[], ApiError> => {
  return useQuery(QueryKey.lookups, getLookupsApi);
};
