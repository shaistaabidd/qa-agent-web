import { useMutation } from '@apollo/client/react';
import { useCallback } from 'react';

import type { AuthGraphQLUser } from '@/features/auth/model/types';
import { startImpersonation } from '@/features/auth/utils/impersonation';
import { toastUnhandledError } from '@/features/auth/utils/mutationError';
import { IMPERSONATE_USER } from '@/graphql/mutations/authMutations';
import { toast } from '@/shared/ui/toast';

type ImpersonateData = {
  impersonateUser?: {
    token?: string | null;
    user?: AuthGraphQLUser | null;
  } | null;
};

export function useImpersonation() {
  const [impersonateUser, { loading }] = useMutation<ImpersonateData>(IMPERSONATE_USER);

  /** Resolves to false when it did not start (refused or failed), so the caller can refresh. */
  const impersonate = useCallback(
    async (userId: string) => {
      try {
        const result = await impersonateUser({ variables: { userId } });
        const payload = result.data?.impersonateUser;

        if (!payload?.token || !payload.user) {
          toast.error('Impersonation failed. Please try again.');
          return false;
        }

        startImpersonation(payload.token, payload.user);
        return true;
      } catch (error) {
        toastUnhandledError(error);
        return false;
      }
    },
    [impersonateUser],
  );

  return { impersonate, loading };
}
