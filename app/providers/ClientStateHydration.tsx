import { useApolloClient } from '@apollo/client/react';
import { useEffect } from 'react';

import {
  onSessionCleared,
  subscribeToAuthStorage,
  useAuthBootstrap,
  useAuthStore,
} from '@/features/auth';

export function ClientStateHydration() {
  const client = useApolloClient();
  useAuthBootstrap();

  useEffect(() => {
    useAuthStore.getState().hydrate();
    return subscribeToAuthStorage();
  }, []);

  // Whatever one user loaded must never be readable by the next person in this tab.
  useEffect(
    () =>
      onSessionCleared(() => {
        void client.clearStore();
      }),
    [client],
  );

  return null;
}
