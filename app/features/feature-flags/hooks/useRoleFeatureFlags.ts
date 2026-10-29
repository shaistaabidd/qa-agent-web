import { useQuery } from '@apollo/client/react';

import { FETCH_FEATURE_FLAGS_FOR_ROLE } from '@/graphql/queries/featureFlagQueries';

import type { FeatureFlagName, FeatureFlagRole } from '../types';

/**
 * Flags as they apply to users of `role`, for screens that act on other people: e.g. whether
 * users of that role can be invited or impersonated. Signed in only.
 */
export function useRoleFeatureFlags(role: FeatureFlagRole) {
  const { data, loading, refetch } = useQuery(FETCH_FEATURE_FLAGS_FOR_ROLE, {
    context: { silentErrors: true },
    fetchPolicy: 'cache-and-network',
    variables: { role },
  });

  const flags = data?.fetchFeatureFlags ?? null;

  return {
    isEnabled: (name: FeatureFlagName) => flags?.[name] === true,
    loaded: flags !== null,
    loading,
    /** Re-reads the flags, e.g. after the API refused an action the UI still offered. */
    refresh: () => {
      void refetch();
    },
  };
}
