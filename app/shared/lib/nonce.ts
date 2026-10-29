import { createContext, useContext } from 'react';

/**
 * The per-request CSP nonce. The server creates it; the client reads it back from the page's script
 * tags (the nonce attribute is hidden after load, the DOM property is not) so both render the same.
 */
export const NonceContext = createContext('');

export function useNonce() {
  return useContext(NonceContext);
}
