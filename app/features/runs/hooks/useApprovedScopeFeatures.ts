import { useQuery } from '@apollo/client/react';

import type { Connection } from '@/features/projects';
import type { ScopeFeature } from '@/features/scope-features';
import { ALL_SCOPE_FEATURES } from '@/graphql/queries/scopeFeatureQueries';

const MAX_FEATURES = 100;

/** The features a run may target. Only approved ones can be dispatched. */
export function useApprovedScopeFeatures(projectId: string, skip: boolean) {
  const { data, loading } = useQuery<{ allScopeFeatures?: Connection<ScopeFeature> | null }>(
    ALL_SCOPE_FEATURES,
    {
      context: { silentErrors: true },
      skip,
      variables: { filter: { perPage: MAX_FEATURES }, projectId },
    },
  );

  return {
    features: (data?.allScopeFeatures?.allData ?? []).filter((feature) => feature.approved),
    loading,
  };
}
