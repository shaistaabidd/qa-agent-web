import type { AuthGraphQLUser } from '@/features/auth/model/types';

const LOGIN_EMAIL_KEY = 'login_email';
const REDIRECT_TO_KEY = 'redirectTo';
const OTP_FLAG_AT_ENTRY_KEY = 'otp_flag_at_entry';
const POST_LOGIN_REDIRECT_KEY = 'post_login_redirect';
const RESET_TOKEN_KEY = 'reset_token';
const USER_ID_KEY = 'user_id';

const FLOW_KEYS = [
  LOGIN_EMAIL_KEY,
  OTP_FLAG_AT_ENTRY_KEY,
  REDIRECT_TO_KEY,
  POST_LOGIN_REDIRECT_KEY,
  RESET_TOKEN_KEY,
  USER_ID_KEY,
];

const LEGACY_KEYS = ['clinic_id', 'user_type'];

const FLOW_TTL_MS = 15 * 60 * 1000;

type StoredValue = {
  expiresAt: number;
  value: string;
};

function remove(key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // Storage can be blocked or full.
  }
}

function read(key: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) {
      return null;
    }

    const stored = JSON.parse(raw) as Partial<StoredValue> | null;
    const value = typeof stored?.value === 'string' ? stored.value.trim() : '';
    if (!value || typeof stored?.expiresAt !== 'number' || stored.expiresAt <= Date.now()) {
      remove(key);
      return null;
    }

    return value;
  } catch {
    remove(key);
    return null;
  }
}

function write(key: string, value: string | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!value) {
    remove(key);
    return;
  }

  try {
    const stored: StoredValue = { expiresAt: Date.now() + FLOW_TTL_MS, value };
    sessionStorage.setItem(key, JSON.stringify(stored));
  } catch {
    // Storage can be blocked or full. The flow falls back to its first step.
  }
}

export function getLoginEmail() {
  return read(LOGIN_EMAIL_KEY);
}

export function setLoginEmail(email: string | null) {
  write(LOGIN_EMAIL_KEY, email);
}

/**
 * Whether the public `otp_enabled` flag was on when the code screen was reached. The public flag
 * is read for the sign-up role, so it can only prove the code step was switched off if it was
 * seen on first; `null` means unknown.
 */
export function getOtpFlagAtEntry() {
  const value = read(OTP_FLAG_AT_ENTRY_KEY);
  return value === 'on' ? true : value === 'off' ? false : null;
}

export function setOtpFlagAtEntry(enabled: boolean | null) {
  write(OTP_FLAG_AT_ENTRY_KEY, enabled === null ? null : enabled ? 'on' : 'off');
}

export function getRedirectTo() {
  return read(REDIRECT_TO_KEY);
}

export function setRedirectTo(path: string | null) {
  write(REDIRECT_TO_KEY, path);
}

export function getPostLoginRedirect() {
  return read(POST_LOGIN_REDIRECT_KEY);
}

export function setPostLoginRedirect(path: string | null) {
  write(POST_LOGIN_REDIRECT_KEY, path);
}

export function getResetToken() {
  return read(RESET_TOKEN_KEY);
}

export function setResetToken(token: string | null) {
  write(RESET_TOKEN_KEY, token);
}

export function persistGraphQLIdentity(user: AuthGraphQLUser) {
  write(USER_ID_KEY, user.id);
}

export function getPersistedUserId() {
  return read(USER_ID_KEY);
}

export function clearRedirectTo() {
  write(REDIRECT_TO_KEY, null);
}

export function clearPasswordResetRedirect() {
  clearRedirectTo();
  write(RESET_TOKEN_KEY, null);
}

export function clearAuthFlowKeys() {
  write(LOGIN_EMAIL_KEY, null);
  write(OTP_FLAG_AT_ENTRY_KEY, null);
  clearPasswordResetRedirect();
}

export function clearAllFlowKeys() {
  if (typeof window === 'undefined') {
    return;
  }

  for (const key of [...FLOW_KEYS, ...LEGACY_KEYS]) {
    remove(key);
  }
}
