import { createContext, useContext } from 'react';

/**
 * The per-request CSP nonce. The server provides one; on the client the context is empty, because
 * browsers hide a nonce once the page has loaded and the scripts it allowed have already run.
 */
export const NonceContext = createContext('');

export function useNonce() {
  return useContext(NonceContext);
}
