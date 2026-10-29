import { useApolloClient } from '@apollo/client/react';
import { useCallback } from 'react';

import { ALL_RESOURCES } from '@/graphql/queries/resourcesQueries';
import type { CrudPageParams, CrudPageResult } from '@/shared/ui/crud';

import { RESOURCE_CATEGORY_ALL, RESOURCE_TAB_ARCHIVED } from '../constants';
import type { Resource } from '../types';

type AllResourcesData = {
  allResources?: {
    allData?: Omit<Resource, 'archived'>[] | null;
    count?: number | null;
  } | null;
};

export function useResources() {
  const client = useApolloClient();

  return useCallback(
    async (params: CrudPageParams): Promise<CrudPageResult<Resource>> => {
      const archived = params.tab === RESOURCE_TAB_ARCHIVED;
      const category = String(params.filters.category ?? RESOURCE_CATEGORY_ALL);

      const result = await client.query({
        // Lists always come from the server: tabs, pages and filters change what a page holds, and
        // other users can change it too.
        // The list shows its own error state, so the global toast would repeat it.
        context: { silentErrors: true },
        fetchPolicy: 'network-only',
        query: ALL_RESOURCES,
        variables: {
          archived,
          category: category === RESOURCE_CATEGORY_ALL ? undefined : category,
          page: params.page,
          perPage: params.pageSize,
          resourceType: archived ? undefined : params.tab?.toUpperCase(),
          search: params.search || undefined,
        },
      });

      if (result.error) {
        throw result.error;
      }

      const payload = (result.data as AllResourcesData | null | undefined)?.allResources;
      const rows = Array.isArray(payload?.allData) ? payload.allData : [];
      const items = rows.map((row) => ({ ...row, archived }));

      return {
        items,
        totalCount: payload?.count ?? items.length,
      };
    },
    [client],
  );
}
