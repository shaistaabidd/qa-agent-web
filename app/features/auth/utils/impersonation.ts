import SecureStorage from 'react-secure-storage';

import { type AuthUser, ORIGINAL_SESSION_KEY, useAuthStore } from '@/features/auth/model/authStore';
import type { AuthGraphQLUser } from '@/features/auth/model/types';
import { applyGraphQLSession } from '@/features/auth/utils/session';

const secureStorage =
  (SecureStorage as { default?: typeof SecureStorage }).default ?? SecureStorage;

type OriginalSession = {
  accessToken: string;
  user: NonNullable<AuthUser>;
};

function readOriginalSession(): OriginalSession | null {
  try {
    const stored = secureStorage.getItem(ORIGINAL_SESSION_KEY) as Partial<OriginalSession> | null;
    return stored && typeof stored === 'object' && stored.accessToken && stored.user
      ? (stored as OriginalSession)
      : null;
  } catch {
    return null;
  }
}

export function isImpersonating() {
  return typeof window !== 'undefined' && readOriginalSession() !== null;
}

/**
 * Switches the session to another user and keeps the admin's own session so they can go back.
 * A full reload follows so every loader and cache starts clean for the new user.
 */
export function startImpersonation(token: string, user: AuthGraphQLUser) {
  const { accessToken, user: current } = useAuthStore.getState();

  // Never overwrite the saved admin session while already impersonating.
  if (!readOriginalSession() && accessToken && current) {
    secureStorage.setItem(ORIGINAL_SESSION_KEY, { accessToken, user: current });
  }

  // The reload below refetches the user; the bootstrap must not also fetch for the switched session.
  useAuthStore.setState({ signInRedirecting: true });
  applyGraphQLSession(token, user);
  window.location.replace('/');
}

export function stopImpersonating() {
  const original = readOriginalSession();
  if (!original) {
    return;
  }

  useAuthStore.setState({ signInRedirecting: true });
  applyGraphQLSession(original.accessToken, original.user);
  try {
    secureStorage.removeItem(ORIGINAL_SESSION_KEY);
  } catch {
    // Storage can be blocked. The restored session still wins on the next load.
  }
  window.location.replace('/');
}
