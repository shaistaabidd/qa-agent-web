/** saas-api's base URL (`VITE_APP_API_URL`, no trailing slash), or '' when unset. */
export function apiBaseUrl() {
  return import.meta.env.VITE_APP_API_URL?.trim().replace(/\/$/, '') ?? '';
}
