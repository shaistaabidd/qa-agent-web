import { useQuery } from '@apollo/client/react';
import { useParams } from 'react-router';

import { FETCH_FINDING } from '@/graphql/queries/findingQueries';

import type { Finding } from '../types';

export function useFindingDetail() {
  const { findingId } = useParams();

  const { data, error, loading } = useQuery<{ fetchFinding?: Finding | null }>(FETCH_FINDING, {
    context: { silentErrors: true },
    skip: !findingId,
    variables: { id: findingId },
  });

  return { error, finding: data?.fetchFinding ?? null, loading };
}
