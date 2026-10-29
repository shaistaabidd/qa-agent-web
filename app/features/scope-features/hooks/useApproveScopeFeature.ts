import { useCallback, useState } from 'react';

import { APPROVE_SCOPE_FEATURE } from '@/graphql/mutations/scopeFeatureMutations';
import { getMessageString } from '@/shared/lib/getMessageString';
import { useMutate } from '@/shared/lib/useMutate';
import { toast } from '@/shared/ui/toast';

/** Approves one feature at a time; `approvingId` says which row is waiting, so only its button shows progress. */
export function useApproveScopeFeature() {
  const mutate = useMutate();
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const approve = useCallback(
    async (id: string) => {
      setApprovingId(id);
      try {
        // The API returns the feature, which Apollo merges into every cached list that has it.
        await mutate(APPROVE_SCOPE_FEATURE, { input: { id } });
        toast.success('Scope feature approved');
      } catch (error) {
        toast.error(getMessageString(error, 'Could not approve the scope feature.'));
      } finally {
        setApprovingId(null);
      }
    },
    [mutate],
  );

  return { approve, approvingId };
}
