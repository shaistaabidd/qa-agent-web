import { useCallback } from 'react';

import { CREATE_PROJECT } from '@/graphql/mutations/projectMutations';
import { evictQueryField } from '@/shared/lib/apolloCache';
import { useMutate } from '@/shared/lib/useMutate';

import type { Project } from '../types';

export function useCreateProject() {
  const mutate = useMutate();

  return useCallback(
    async (input: { name: string; targetUrl: string }) => {
      const data = await mutate<{ createProject: { project: Project } }>(
        CREATE_PROJECT,
        { input },
        (cache) => evictQueryField(cache, 'allProjects'),
      );
      return data.createProject.project;
    },
    [mutate],
  );
}
