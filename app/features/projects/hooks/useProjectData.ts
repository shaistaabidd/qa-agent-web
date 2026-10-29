import { useQuery } from '@apollo/client/react';
import { useOutletContext, useParams } from 'react-router';

import { FETCH_PROJECT } from '@/graphql/queries/projectQueries';

import type { Project } from '../types';

/** Loads the project in the URL. Used once, by the project layout. */
export function useProjectData() {
  const { projectId } = useParams();

  const { data, error, loading } = useQuery<{ fetchProject?: Project | null }>(FETCH_PROJECT, {
    context: { silentErrors: true },
    skip: !projectId,
    variables: { id: projectId },
  });

  return { error, loading, project: data?.fetchProject ?? null };
}

/** The project the layout loaded, for any page inside it. */
export function useProject() {
  return useOutletContext<Project>();
}
