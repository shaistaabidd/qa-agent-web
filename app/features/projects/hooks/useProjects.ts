import { useQuery } from '@apollo/client/react';
import { parseAsInteger, useQueryState } from 'nuqs';

import { ALL_PROJECTS } from '@/graphql/queries/projectQueries';

import { PROJECTS_PER_PAGE } from '../constants';
import type { Connection, Project } from '../types';

type AllProjectsData = { allProjects?: Connection<Project> | null };

export function useProjects() {
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ history: 'replace' }),
  );

  const { data, error, loading, refetch } = useQuery<AllProjectsData>(ALL_PROJECTS, {
    context: { silentErrors: true },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: { filter: { page, perPage: PROJECTS_PER_PAGE } },
  });

  const payload = data?.allProjects;
  const projects = payload?.allData ?? [];
  const count = payload?.count ?? projects.length;
  const showingFrom = count === 0 ? 0 : (page - 1) * PROJECTS_PER_PAGE + 1;

  return {
    count,
    error,
    loading: loading && !data,
    page,
    projects,
    refetch,
    setPage,
    showingFrom,
    showingTo: count === 0 ? 0 : showingFrom + projects.length - 1,
    totalPages: payload?.totalPages || 1,
  };
}
