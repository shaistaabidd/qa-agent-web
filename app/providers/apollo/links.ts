import { ApolloLink } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs';

import { useAuthStore } from '@/features/auth';

import { createErrorLink } from './errorLink';

function graphqlUri() {
  const base = import.meta.env.VITE_APP_API_URL;

  if (typeof base === 'string' && base.trim()) {
    return `${base.trim().replace(/\/$/, '')}/graphql`;
  }

  throw new Error('Set VITE_APP_API_URL before running a GraphQL operation.');
}

function authorizationHeader(request?: Request) {
  if (request) {
    const header = request.headers.get('authorization')?.trim();
    return header || null;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  const token = useAuthStore.getState().accessToken?.trim();
  return token ? `Bearer ${token}` : null;
}

export function createLink(request?: Request) {
  const authLink = new SetContextLink((prevContext) => {
    const authorization = authorizationHeader(request);

    if (!authorization) {
      return {};
    }

    return {
      headers: {
        ...prevContext.headers,
        authorization,
      },
    };
  });

  return ApolloLink.from([createErrorLink(), authLink, new UploadHttpLink({ uri: graphqlUri })]);
}
