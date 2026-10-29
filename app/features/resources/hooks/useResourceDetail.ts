import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';

import { FETCH_RESOURCE } from '@/graphql/queries/resourcesQueries';

import type { Resource } from '../types';

type FetchResourceData = {
  fetchResource?: Omit<Resource, 'archived'> | null;
};

/** Description, video link and document are not in the list query, so edit loads them here. */
export function useResourceDetail(id: string) {
  const { data, error, loading, refetch } = useQuery(FETCH_RESOURCE, {
    context: { silentErrors: true },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: { id },
  });

  const detail = (data as FetchResourceData | undefined)?.fetchResource;
  const resource = useMemo(() => (detail ? { ...detail, archived: false } : null), [detail]);

  return { error, loading, refetch, resource };
}
