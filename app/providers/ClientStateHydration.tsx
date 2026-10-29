import '@/features/onboarding';

import { useEffect } from 'react';

import { subscribeToAuthStorage, useAuthBootstrap, useAuthStore } from '@/features/auth';

export function ClientStateHydration() {
  useAuthBootstrap();

  useEffect(() => {
    useAuthStore.getState().hydrate();
    return subscribeToAuthStorage();
  }, []);

  return null;
}
