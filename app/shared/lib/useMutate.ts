import type { ApolloCache, DocumentNode } from '@apollo/client';
import { useApolloClient } from '@apollo/client/react';
import { useCallback } from 'react';

/**
 * Runs a mutation and throws when it fails, so the caller decides how to show the error: the error
 * link stays quiet (`silentErrors`) to avoid a second toast.
 */
export function useMutate() {
  const client = useApolloClient();

  return useCallback(
    async <TData>(
      mutation: DocumentNode,
      variables: Record<string, unknown>,
      update?: (cache: ApolloCache) => void,
    ) => {
      const result = await client.mutate<TData>({
        context: { silentErrors: true },
        mutation,
        update,
        variables,
      });
      if (result.error) {
        throw result.error;
      }
      return result.data as TData;
    },
    [client],
  );
}
