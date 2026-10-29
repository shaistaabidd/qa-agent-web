import { useApolloClient, useQuery } from '@apollo/client/react';
import { useEffect } from 'react';

import { useAuthStore } from '@/features/auth';
import { FETCH_PUBLIC_FEATURE_FLAGS } from '@/graphql/queries/featureFlagQueries';

import type { FeatureFlagName, FeatureFlags } from '../types';

/**
 * The caller's feature flags. Signed in, they come with the session user (fetchUser and the
 * sign-in mutations select them), so no request is made. Signed out (login, sign-up), only
 * `signUpEnabled`, `otpEnabled` and `googleSignInEnabled` are available, from
 * `fetchPublicFeatureFlags`, and they are read again whenever the tab becomes visible so a flag
 * switched while the page sat open shows.
 */
export function useFeatureFlags() {
  const client = useApolloClient();
  const signedIn = useAuthStore((state) => Boolean(state.accessToken));
  const sessionFlags = useAuthStore((state) => state.user?.featureFlags ?? null);
  const { data, loading, refetch } = useQuery(FETCH_PUBLIC_FEATURE_FLAGS, {
    context: { silentErrors: true },
    fetchPolicy: 'cache-and-network',
    skip: signedIn,
  });

  useEffect(() => {
    if (signedIn) {
      return;
    }

    function onVisible() {
      if (document.visibilityState === 'visible') {
        void refetch().catch(() => {});
      }
    }

    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refetch, signedIn]);

  const flags: Partial<FeatureFlags> | null = signedIn
    ? sessionFlags
    : (data?.fetchPublicFeatureFlags ?? null);

  return {
    /** True only once the API has confirmed the flag is on, so gated UI stays hidden until then. */
    isEnabled: (name: FeatureFlagName) => flags?.[name] === true,
    loaded: flags !== null,
    loading: !signedIn && loading,
    /** Asks again, e.g. after a failed request or after the API refused something the page offered. */
    refresh: () => {
      if (signedIn) {
        void client.refetchQueries({ include: ['FetchUser'] }).catch(() => {});
        return;
      }

      void refetch().catch(() => {});
    },
  };
}
