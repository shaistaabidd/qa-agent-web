import { createApolloLoaderHandler } from '@apollo/client-integration-react-router';

import { makeClient } from './client';

export const apolloLoader = createApolloLoaderHandler(makeClient);
