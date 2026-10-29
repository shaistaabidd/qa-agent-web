import { useApolloClient } from '@apollo/client/react';
import { useCallback } from 'react';

import { ALL_SMS_LOGS } from '@/graphql/queries/smsLogQueries';
import type { CrudPageParams, CrudPageResult } from '@/shared/ui/crud';

import type { SmsLog } from '../types';
import { buildSmsLogQueryFilter } from '../utils';

type AllSmsLogsData = {
  allSmsLogs?: {
    allData?: SmsLog[] | null;
    count?: number | null;
  } | null;
};

export function useSmsLogs() {
  const client = useApolloClient();

  return useCallback(
    async (params: CrudPageParams): Promise<CrudPageResult<SmsLog>> => {
      const result = await client.query({
        context: { silentErrors: true },
        fetchPolicy: 'network-only',
        query: ALL_SMS_LOGS,
        variables: { filter: buildSmsLogQueryFilter(params) },
      });

      if (result.error) {
        throw result.error;
      }

      const payload = (result.data as AllSmsLogsData | null | undefined)?.allSmsLogs;
      const items = Array.isArray(payload?.allData) ? payload.allData : [];

      return {
        items,
        totalCount: payload?.count ?? items.length,
      };
    },
    [client],
  );
}
