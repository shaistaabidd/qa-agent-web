import { ApolloClient } from '@apollo/client-integration-react-router';

import { createCache } from './cache';
import { createLink } from './links';

export function makeClient(request?: Request) {
  return new ApolloClient({
    cache: createCache(),
    dataMasking: true,
    link: createLink(request),
  });
}
