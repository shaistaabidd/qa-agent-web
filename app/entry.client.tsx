import { ApolloProvider } from '@apollo/client/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import type { ClientOnErrorFunction } from 'react-router';
import { HydratedRouter } from 'react-router/dom';

import { makeClient } from '@/providers/apollo';
import { reportError } from '@/shared/lib/reportError';

const onError: ClientOnErrorFunction = (error) => {
  reportError(error);
};

startTransition(() => {
  const client = makeClient();

  hydrateRoot(
    document,
    <StrictMode>
      <ApolloProvider client={client}>
        <HydratedRouter onError={onError} />
      </ApolloProvider>
    </StrictMode>,
  );
});
