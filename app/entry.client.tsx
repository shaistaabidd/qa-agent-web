import { ApolloProvider } from '@apollo/client/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import type { ClientOnErrorFunction } from 'react-router';
import { HydratedRouter } from 'react-router/dom';

import { makeClient } from '@/providers/apollo';
import { NonceContext } from '@/shared/lib/nonce';
import { reportError } from '@/shared/lib/reportError';

const onError: ClientOnErrorFunction = (error) => {
  reportError(error);
};

// Browsers hide the nonce attribute once the page has loaded, but the property keeps its value.
// Rendering the same nonce as the server keeps hydration from seeing a difference.
const nonce = [...document.scripts].find((script) => script.nonce)?.nonce ?? '';

startTransition(() => {
  const client = makeClient();

  hydrateRoot(
    document,
    <StrictMode>
      <NonceContext.Provider value={nonce}>
        <ApolloProvider client={client}>
          <HydratedRouter onError={onError} />
        </ApolloProvider>
      </NonceContext.Provider>
    </StrictMode>,
  );
});
