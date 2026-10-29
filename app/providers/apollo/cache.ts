import { InMemoryCache } from '@apollo/client';

export function createCache() {
  return new InMemoryCache();
}
