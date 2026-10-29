import { useCallback } from 'react';

import { CONNECT_CLICK_UP } from '@/graphql/mutations/projectMutations';
import { useMutate } from '@/shared/lib/useMutate';

export function useConnectClickUp(projectId: string) {
  const mutate = useMutate();

  return useCallback(
    (listId: string) => mutate(CONNECT_CLICK_UP, { input: { listId, projectId } }),
    [mutate, projectId],
  );
}
