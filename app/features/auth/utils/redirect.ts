import { LOGIN_PATH } from '@/features/auth/paths';
import { setPostLoginRedirect } from '@/features/auth/utils/flowStorage';

export const REDIRECT_PARAM = 'redirect';

const BLOCKED_PREFIXES = [
  '/login',
  '/otp',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/setup-account',
  '/set-password',
  '/invite-expired',
];

function hasUnsafeChars(value: string) {
  for (const char of value) {
    const code = char.charCodeAt(0);
    if (code <= 0x1f || code === 0x7f || char === '\\' || /\s/.test(char)) {
      return true;
    }
  }

  return false;
}
const PLACEHOLDER_ORIGIN = 'http://redirect.invalid';

function isSameOriginPath(path: string) {
  try {
    return new URL(path, PLACEHOLDER_ORIGIN).origin === PLACEHOLDER_ORIGIN;
  } catch {
    return false;
  }
}

/** Accepts only same-site paths, so `?redirect=https://evil.com` can never leave the app. */
export function safeRedirectPath(value: string | null | undefined) {
  const path = value?.trim();
  if (!path || !path.startsWith('/') || path.startsWith('//') || hasUnsafeChars(path)) {
    return null;
  }

  const pathname = path.split(/[?#]/)[0];
  let decodedPathname: string;
  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  if (
    decodedPathname.startsWith('//') ||
    hasUnsafeChars(decodedPathname) ||
    !isSameOriginPath(path)
  ) {
    return null;
  }

  if (pathname === '/') {
    return null;
  }

  const lowerPathname = decodedPathname.toLowerCase();
  if (
    BLOCKED_PREFIXES.some(
      (prefix) => lowerPathname === prefix || lowerPathname.startsWith(`${prefix}/`),
    )
  ) {
    return null;
  }

  return path;
}

export function loginPathWithRedirect(destination: string) {
  const safe = safeRedirectPath(destination);
  if (!safe) {
    return LOGIN_PATH;
  }

  return `${LOGIN_PATH}?${REDIRECT_PARAM}=${encodeURIComponent(safe)}`;
}

/** Keeps the page's safe `?redirect=` for after sign-in, or drops an earlier one when there is none. */
export function rememberPostLoginRedirect() {
  setPostLoginRedirect(
    safeRedirectPath(new URLSearchParams(window.location.search).get(REDIRECT_PARAM)),
  );
}
