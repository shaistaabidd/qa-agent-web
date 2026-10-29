import SecureStorage from 'react-secure-storage';
import { create } from 'zustand';

import { type AuthGraphQLUser, normalizeUserType } from '@/features/auth/model/types';
import { clearOtpTimer } from '@/features/auth/otpTimer';
import { clearAllFlowKeys } from '@/features/auth/utils/flowStorage';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  ORIGINAL_SESSION: 'original_session',
  ROLE: 'role',
  USER: 'user',
} as const;

/** Holds the admin's own session while they are signed in as another user. */
export const ORIGINAL_SESSION_KEY = STORAGE_KEYS.ORIGINAL_SESSION;

const AUTH_ERROR_KEY = 'auth_error';

const sessionClearedListeners = new Set<() => void>();

export function onSessionCleared(listener: () => void) {
  sessionClearedListeners.add(listener);
  return () => {
    sessionClearedListeners.delete(listener);
  };
}

const secureStorage =
  (SecureStorage as { default?: typeof SecureStorage }).default ?? SecureStorage;

export type AuthUser =
  | (AuthGraphQLUser & {
      name?: string;
      status?: string;
    })
  | null;

type AuthSession = {
  accessToken?: string;
  user?: AuthUser;
};

type AuthState = {
  accessToken: string | null;
  isAuthenticated: boolean;
  role: string | null;
  /** True once a sign-in or impersonation switch has started its page reload, which refetches the user. */
  signInRedirecting: boolean;
  user: AuthUser;
  clearSession: () => void;
  hydrate: () => void;
  setSession: (session: AuthSession) => void;
};

function readString(key: string) {
  const value = secureStorage.getItem(key);
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function readPersistedToken() {
  try {
    return readString(STORAGE_KEYS.ACCESS_TOKEN);
  } catch {
    return null;
  }
}

function toAuthErrorMessage(error: unknown) {
  if (typeof error !== 'string') {
    return null;
  }

  const message = error.trim();
  if (!message || message === '[object Object]') {
    return null;
  }

  return message;
}

function roleFromUser(user: AuthUser) {
  return user ? normalizeUserType(user.userType) : null;
}

function removeSecureItems() {
  for (const key of Object.values(STORAGE_KEYS)) {
    try {
      secureStorage.removeItem(key);
    } catch {
      // Storage can be blocked.
    }
  }
}

function attempt(step: () => void) {
  try {
    step();
  } catch {
    // One failing cleanup step must not skip the rest.
  }
}

function clearBrowserStorage() {
  if (typeof window === 'undefined') {
    return;
  }

  attempt(removeSecureItems);
  attempt(clearAllFlowKeys);
  attempt(clearOtpTimer);
  attempt(() => sessionStorage.removeItem(AUTH_ERROR_KEY));
}

function sameUser(a: AuthUser, b: AuthUser) {
  return a === b || JSON.stringify(a) === JSON.stringify(b);
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  isAuthenticated: false,
  role: null,
  signInRedirecting: false,
  user: null,

  clearSession() {
    clearBrowserStorage();
    for (const listener of sessionClearedListeners) {
      attempt(listener);
    }

    set({
      accessToken: null,
      isAuthenticated: false,
      role: null,
      user: null,
    });
  },

  hydrate() {
    if (typeof window === 'undefined') {
      return;
    }

    let accessToken: string | null = null;
    let storedRole: string | null = null;
    let user: AuthUser = null;

    try {
      accessToken = readString(STORAGE_KEYS.ACCESS_TOKEN);
      storedRole = readString(STORAGE_KEYS.ROLE);
      const storedUser = secureStorage.getItem(STORAGE_KEYS.USER);
      user = storedUser && typeof storedUser === 'object' ? (storedUser as AuthUser) : null;
    } catch {
      accessToken = null;
    }

    const role = roleFromUser(user);

    if (accessToken && storedRole && storedRole !== role) {
      get().clearSession();
      return;
    }

    const current = get();
    if (
      current.accessToken === accessToken &&
      current.role === role &&
      sameUser(current.user, user)
    ) {
      return;
    }

    set({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      role,
      user,
    });
  },

  setSession(session) {
    const nextUser = session.user ?? get().user;
    const role = roleFromUser(nextUser);
    const currentToken = get().accessToken;

    // Another tab logged out: do not write a stale session back into storage.
    if (
      currentToken &&
      (!session.accessToken || session.accessToken === currentToken) &&
      readPersistedToken() === null
    ) {
      get().hydrate();
      return;
    }

    if (session.accessToken) {
      secureStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, session.accessToken);
    }
    if (session.user) {
      secureStorage.setItem(STORAGE_KEYS.USER, session.user);
    }
    if (role) {
      secureStorage.setItem(STORAGE_KEYS.ROLE, role);
    } else {
      attempt(() => secureStorage.removeItem(STORAGE_KEYS.ROLE));
    }

    set((state) => {
      const accessToken = session.accessToken ?? state.accessToken;

      return {
        accessToken,
        isAuthenticated: Boolean(accessToken),
        role,
        user: nextUser ?? state.user,
      };
    });
  },
}));

export function peekAuthError() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return toAuthErrorMessage(sessionStorage.getItem(AUTH_ERROR_KEY));
  } catch {
    return null;
  }
}

export function clearAuthError() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    sessionStorage.removeItem(AUTH_ERROR_KEY);
  } catch {
    // Storage can be blocked.
  }
}

/** Returns true when the browser is being sent to the login page. */
export function logout(error?: unknown) {
  const message = toAuthErrorMessage(error);

  try {
    useAuthStore.getState().clearSession();
  } catch {
    // Redirecting below is what matters.
  }

  if (typeof window === 'undefined' || window.location.pathname === '/login') {
    return false;
  }

  if (message) {
    attempt(() => sessionStorage.setItem(AUTH_ERROR_KEY, message));
  }

  window.location.replace('/login');
  return true;
}

/** Mirrors logins and logouts from other tabs. Call once on the client; returns a cleanup. */
export function subscribeToAuthStorage() {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && !event.key.includes(STORAGE_KEYS.ACCESS_TOKEN)) {
      return;
    }

    // The token was removed (or storage cleared) in another tab. Act on the event itself: the
    // secure-storage library can still return its cached copy of the token to this tab.
    if (event.newValue === null && Boolean(useAuthStore.getState().accessToken)) {
      logout();
      return;
    }

    useAuthStore.getState().hydrate();
  };

  window.addEventListener('storage', onStorage);
  return () => window.removeEventListener('storage', onStorage);
}
