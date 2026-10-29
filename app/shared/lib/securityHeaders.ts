/** A fresh, unguessable value for each document response. */
export function createNonce() {
  return btoa(crypto.randomUUID());
}

function apiOrigin(apiUrl: string | undefined) {
  try {
    return apiUrl ? new URL(apiUrl).origin : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Headers for every HTML response.
 *
 * Enforced: the directives that can't affect how the app's own scripts run (framing, plugins, base
 * URI, form targets), plus HSTS, no MIME sniffing and a referrer and permissions policy.
 *
 * Report only: the strict policy, with scripts limited to this origin and the request's nonce. The
 * browser reports what it would have blocked without blocking it, so it can be checked against the
 * real app and then moved into the enforced policy.
 */
export function securityHeaders(nonce: string, apiUrl?: string): Record<string, string> {
  const connect = ["'self'", apiOrigin(apiUrl)].filter(Boolean).join(' ');

  return {
    'Content-Security-Policy': [
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
    'Content-Security-Policy-Report-Only': [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}'`,
      "style-src 'self' 'unsafe-inline'",
      // Evidence screenshots are signed URLs on the storage host.
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      `connect-src ${connect}`,
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };
}
