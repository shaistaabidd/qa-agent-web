import { redirect, redirectDocument } from 'react-router';

import { useAuthStore } from '@/features/auth/model/authStore';
import type { AuthGraphQLUser } from '@/features/auth/model/types';
import { normalizeUserType } from '@/features/auth/model/types';
import { HOME_PATH, LOGIN_PATH } from '@/features/auth/paths';
import { getLoginEmail } from '@/features/auth/utils/flowStorage';
import {
  allowedPathForIncompleteSetup,
  getNextRequiredStep,
  pathAfterGraphQLAuth,
  SETUP_PATHS,
} from '@/features/auth/utils/nextStep';
import { loginPathWithRedirect } from '@/features/auth/utils/redirect';
import { Role } from '@/shared/lib/constants';

export { Role };

export { HOME_PATH, LOGIN_PATH };
export const OTP_PATH = '/otp';
export const RESET_PASSWORD_PATH = '/reset-password';
export const RESET_PASSWORD_SUCCESS_PATH = '/reset-password/success';
export const SET_PASSWORD_PATH = SETUP_PATHS.setPassword;
export const INVITE_EXPIRED_PATH = SETUP_PATHS.inviteExpired;

export function tokenFromResetUrl(resetUrl: string) {
  try {
    return new URL(resetUrl, 'https://app.local').searchParams.get('token')?.trim() ?? '';
  } catch {
    return '';
  }
}

export function resetPasswordPath(token: string) {
  return `${RESET_PASSWORD_PATH}?token=${encodeURIComponent(token)}`;
}

export function pathFromResetUrl(resetUrl: string) {
  const token = tokenFromResetUrl(resetUrl);
  return token ? resetPasswordPath(token) : null;
}

export function homePathForRole(_role: string | null) {
  return HOME_PATH;
}

export function pathAfterAuth(user: AuthGraphQLUser | null | undefined) {
  if (!user?.userType) {
    return HOME_PATH;
  }

  return pathAfterGraphQLAuth(user);
}

export function toAppRole(role: string | null) {
  return normalizeUserType(role) === 'super_admin' ? ('admin' as const) : ('user' as const);
}

export function displayName(user: {
  email: string;
  firstName?: string | null;
  fullName?: string | null;
  lastName?: string | null;
  name?: string | null;
}) {
  const fromName = user.name?.trim();
  if (fromName) {
    return fromName;
  }

  const fromFull = user.fullName?.trim();
  if (fromFull) {
    return fromFull;
  }

  const fromParts = [user.firstName, user.lastName]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(' ')
    .trim();

  return fromParts || user.email;
}

function isBrowser() {
  return typeof window !== 'undefined';
}

function pathnameFrom(request?: Request) {
  if (request) {
    return new URL(request.url).pathname;
  }

  return window.location.pathname;
}

/** Soft SPA redirect. Use for simple guest/login bounces. */
function softRedirect(to: string, pathname: string) {
  if (to === pathname) {
    return;
  }

  throw redirect(to);
}

/**
 * Full document navigation. Use when bouncing between app shell and setup
 * so SPA middleware/loader pairs cannot thrash the main thread.
 */
function hardRedirect(to: string, pathname: string) {
  if (to === pathname) {
    return;
  }

  throw redirectDocument(to);
}

export function redirectToAppOrLogin(request: Request) {
  if (!isBrowser()) {
    return;
  }

  useAuthStore.getState().hydrate();

  const { accessToken, user } = useAuthStore.getState();
  const pathname = new URL(request.url).pathname;

  if (accessToken && user) {
    hardRedirect(pathAfterAuth(user), pathname);
    return;
  }

  softRedirect(LOGIN_PATH, pathname);
}

type RequireAuthOptions = {
  /** Set false for unknown URLs: there is no real page to return to after login. */
  rememberDestination?: boolean;
};

function requestedDestination(request?: Request) {
  if (request) {
    const url = new URL(request.url);
    return `${url.pathname}${url.search}`;
  }

  return `${window.location.pathname}${window.location.search}`;
}

export function requireAuth(request?: Request, options: RequireAuthOptions = {}) {
  if (!isBrowser()) {
    return;
  }

  useAuthStore.getState().hydrate();

  const { accessToken, user } = useAuthStore.getState();
  const pathname = pathnameFrom(request);

  if (!accessToken || !user) {
    const remember = options.rememberDestination ?? true;
    softRedirect(
      remember ? loginPathWithRedirect(requestedDestination(request)) : LOGIN_PATH,
      pathname,
    );
    return;
  }

  const next = getNextRequiredStep(user);
  if (next) {
    hardRedirect(next, pathname);
  }
}

export function requireSetup(request?: Request) {
  if (!isBrowser()) {
    return;
  }

  useAuthStore.getState().hydrate();

  const { accessToken, user } = useAuthStore.getState();
  const pathname = pathnameFrom(request);

  if (!accessToken || !user) {
    softRedirect(LOGIN_PATH, pathname);
    return;
  }

  if (!allowedPathForIncompleteSetup(user, pathname)) {
    hardRedirect(pathAfterAuth(user), pathname);
  }
}

export function requireGuest(request: Request) {
  if (!isBrowser()) {
    return;
  }

  useAuthStore.getState().hydrate();

  const { accessToken, user } = useAuthStore.getState();
  const pathname = new URL(request.url).pathname;

  if (accessToken && user) {
    const isPasswordReset =
      pathname === RESET_PASSWORD_PATH || pathname === RESET_PASSWORD_SUCCESS_PATH;

    if (isPasswordReset) {
      return;
    }

    hardRedirect(pathAfterAuth(user), pathname);
    return;
  }

  if (pathname === OTP_PATH && !getLoginEmail()) {
    softRedirect(LOGIN_PATH, pathname);
  }
}

export function requireRoles(request: Request, allowed: Role[]) {
  if (!isBrowser()) {
    return;
  }

  useAuthStore.getState().hydrate();

  const { accessToken, role, user } = useAuthStore.getState();
  const pathname = pathnameFrom(request);

  if (!accessToken || !user) {
    softRedirect(loginPathWithRedirect(requestedDestination(request)), pathname);
    return;
  }

  const next = getNextRequiredStep(user);
  if (next) {
    hardRedirect(next, pathname);
    return;
  }

  if (!role || !allowed.includes(role as Role)) {
    throw new Response('Not Found', { status: 404, statusText: 'Not Found' });
  }
}
