import { useApolloClient } from '@apollo/client/react';
import { useCallback } from 'react';

import { ALL_USERS } from '@/graphql/queries/coAdminQueries';
import type { CrudPageParams, CrudPageResult } from '@/shared/ui/crud';

import { CO_ADMIN_TAB_ARCHIVED, CO_ADMIN_TAB_PENDING, MANAGED_USER_TYPE } from '../constants';
import type { CoAdmin, CoAdminStatus } from '../types';

type AllUsersData = {
  allUsers?: {
    allData?: Omit<CoAdmin, 'status'>[] | null;
    count?: number | null;
  } | null;
};

function statusForTab(tab: string | null): CoAdminStatus {
  if (tab === CO_ADMIN_TAB_PENDING) return 'pending';
  if (tab === CO_ADMIN_TAB_ARCHIVED) return 'archived';
  return 'active';
}

export function useCoAdmins() {
  const client = useApolloClient();

  return useCallback(
    async (params: CrudPageParams): Promise<CrudPageResult<CoAdmin>> => {
      const status = statusForTab(params.tab);

      const result = await client.query({
        // The list shows its own error state, so the global toast would repeat it.
        context: { silentErrors: true },
        fetchPolicy: 'network-only',
        query: ALL_USERS,
        variables: {
          archived: status === 'archived',
          page: params.page,
          pending: status === 'pending',
          perPage: params.pageSize,
          search: params.search || undefined,
          userType: MANAGED_USER_TYPE,
        },
      });

      if (result.error) {
        throw result.error;
      }

      const payload = (result.data as AllUsersData | null | undefined)?.allUsers;
      const rows = Array.isArray(payload?.allData) ? payload.allData : [];
      const items = rows.map((row) => ({ ...row, status }));

      return { items, totalCount: payload?.count ?? items.length };
    },
    [client],
  );
}
