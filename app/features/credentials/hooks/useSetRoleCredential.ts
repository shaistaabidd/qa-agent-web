import { useCallback } from 'react';

import { SET_ROLE_CREDENTIAL } from '@/graphql/mutations/roleCredentialMutations';
import { evictQueryField } from '@/shared/lib/apolloCache';
import { useMutate } from '@/shared/lib/useMutate';

export function useSetRoleCredential(projectId: string) {
  const mutate = useMutate();

  return useCallback(
    (roleName: string, credentialValue: string) =>
      mutate(SET_ROLE_CREDENTIAL, { input: { credentialValue, projectId, roleName } }, (cache) =>
        evictQueryField(cache, 'allRoleCredentials'),
      ),
    [mutate, projectId],
  );
}
