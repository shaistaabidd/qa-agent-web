import { useApolloClient } from '@apollo/client/react';
import { useState } from 'react';

import {
  applyGraphQLSession,
  type AuthGraphQLUser,
  hardNavigateAfterAuth,
  useAuthStore,
} from '@/features/auth';
import { FETCH_USER } from '@/graphql/queries/userQueries';
import { toast } from '@/shared/ui/toast';

type FetchUserData = {
  fetchUser?: AuthGraphQLUser;
};

/** Continues only after the server reports the subscription as paid. */
export function useConfirmSubscription() {
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);

  async function confirmSubscription() {
    const { accessToken, user } = useAuthStore.getState();

    if (!user?.id || !accessToken) {
      toast.error('Session expired. Please log in again.');
      return;
    }

    setLoading(true);

    try {
      const result = await client.query<FetchUserData>({
        fetchPolicy: 'network-only',
        query: FETCH_USER,
        variables: { fetchUserId: user.id },
      });
      const serverUser = result.data?.fetchUser;

      if (!serverUser?.subscriptionPaid) {
        toast.error('We have not received your payment yet. Please try again in a moment.');
        return;
      }

      hardNavigateAfterAuth(applyGraphQLSession(accessToken, serverUser));
    } catch {
      // The Apollo error link already shows this failure.
    } finally {
      setLoading(false);
    }
  }

  return { confirmSubscription, loading };
}
