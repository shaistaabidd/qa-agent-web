import { useQuery } from '@apollo/client/react';

import { ALL_ROLE_CREDENTIALS } from '@/graphql/queries/roleCredentialQueries';

import type { RoleCredential } from '../types';

export function useRoleCredentials(projectId: string) {
  const { data, error, loading, refetch } = useQuery<{
    allRoleCredentials?: RoleCredential[] | null;
  }>(ALL_ROLE_CREDENTIALS, {
    context: { silentErrors: true },
    fetchPolicy: 'cache-and-network',
    variables: { projectId },
  });

  return {
    credentials: data?.allRoleCredentials ?? [],
    error,
    loading: loading && !data,
    refetch,
  };
}
