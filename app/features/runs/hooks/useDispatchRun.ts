import { useCallback } from 'react';

import { DISPATCH_RUN } from '@/graphql/mutations/runMutations';
import { evictQueryField } from '@/shared/lib/apolloCache';
import { useMutate } from '@/shared/lib/useMutate';

import type { Run } from '../types';

export function useDispatchRun() {
  const mutate = useMutate();

  return useCallback(
    async (scopeFeatureId: string, roleName: string) => {
      const data = await mutate<{ dispatchRun: { run: Run } }>(
        DISPATCH_RUN,
        { input: { roleName, scopeFeatureId } },
        (cache) => evictQueryField(cache, 'allRuns'),
      );
      return data.dispatchRun.run;
    },
    [mutate],
  );
}
