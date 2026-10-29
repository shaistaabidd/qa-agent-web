import { rememberPostLoginRedirect } from '@/features/auth/utils/redirect';
import { apiBaseUrl } from '@/shared/lib/apiUrl';

/**
 * Sign in with Google runs on saas-api, which holds every Google setting: the browser goes to the
 * API, on to Google, back to the API, then to /auth/google/callback here with a one-time code in
 * the URL fragment. The nonce stays in this tab's sessionStorage, and the API only turns the code
 * into a session for the tab holding it, so a forwarded link can't sign anyone else in.
 */
const NONCE_KEY = 'google_sign_in_nonce';

/** Same as the API's `Auth::GoogleSignIn::STATE_TTL`: past it the API refuses the sign-in anyway. */
const NONCE_TTL_MS = 10 * 60 * 1000;

/**
 * `crypto.randomUUID` only exists in secure contexts (HTTPS or localhost), so on a plain-HTTP
 * staging or LAN host it is undefined. `getRandomValues` works everywhere; this builds the same
 * v4 UUID shape from it.
 */
function generateNonce() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function startGoogleSignIn() {
  const nonce = generateNonce();
  sessionStorage.setItem(NONCE_KEY, JSON.stringify({ nonce, at: Date.now() }));
  rememberPostLoginRedirect();
  window.location.assign(`${apiBaseUrl()}/auth/google?${new URLSearchParams({ nonce })}`);
}

/** The nonce this tab started with, removed so it can be used once. Null once it has expired. */
export function takeGoogleNonce() {
  try {
    const stored = sessionStorage.getItem(NONCE_KEY);
    sessionStorage.removeItem(NONCE_KEY);
    if (!stored) return null;
    const { nonce, at } = JSON.parse(stored) as { nonce?: unknown; at?: unknown };
    if (typeof nonce !== 'string' || typeof at !== 'number') return null;
    return Date.now() - at > NONCE_TTL_MS ? null : nonce;
  } catch {
    return null;
  }
}

/** The one-time code from the callback URL's fragment (`#code=…`). */
export function googleCallbackCode(hash: string) {
  return new URLSearchParams(hash.replace(/^#/, '')).get('code');
}
