import { useQuery } from '@apollo/client/react';
import { parseAsInteger, useQueryState } from 'nuqs';

import type { Connection } from '@/features/projects';
import { ALL_SCOPE_FEATURES } from '@/graphql/queries/scopeFeatureQueries';

import { SCOPE_FEATURES_PER_PAGE } from '../constants';
import type { ScopeFeature } from '../types';

export function useScopeFeatures(projectId: string) {
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ history: 'replace' }),
  );

  const { data, error, loading, refetch } = useQuery<{
    allScopeFeatures?: Connection<ScopeFeature> | null;
  }>(ALL_SCOPE_FEATURES, {
    context: { silentErrors: true },
    // A scan finishes in the background, so look again whenever the tab opens.
    fetchPolicy: 'cache-and-network',
    variables: { filter: { page, perPage: SCOPE_FEATURES_PER_PAGE }, projectId },
  });

  const payload = data?.allScopeFeatures;
  const features = payload?.allData ?? [];
  const count = payload?.count ?? features.length;
  const showingFrom = count === 0 ? 0 : (page - 1) * SCOPE_FEATURES_PER_PAGE + 1;

  return {
    count,
    error,
    features,
    loading: loading && !data,
    page,
    refetch,
    setPage,
    showingFrom,
    showingTo: count === 0 ? 0 : showingFrom + features.length - 1,
    totalPages: payload?.totalPages || 1,
  };
}
