import { useApolloClient, useQuery } from '@apollo/client/react';
import { useCallback } from 'react';

import type { Project } from '@/features/projects';
import { CONNECT_GITHUB } from '@/graphql/mutations/integrationMutations';
import { SCAN_CODEBASE } from '@/graphql/mutations/scopeFeatureMutations';
import {
  ALL_GITHUB_REPOSITORIES,
  FETCH_GITHUB_AUTHORIZE_URL,
  FETCH_GITHUB_INSTALL_URL,
} from '@/graphql/queries/integrationQueries';
import { useMutate } from '@/shared/lib/useMutate';

import { GITHUB_INSTALL_STATE_KEY } from '../constants';

type UrlQuery = typeof FETCH_GITHUB_INSTALL_URL | typeof FETCH_GITHUB_AUTHORIZE_URL;

export function useGithubConnect(project: Project) {
  const client = useApolloClient();
  const mutate = useMutate();

  const repositories = useQuery<{ allGithubRepositories?: string[] | null }>(
    ALL_GITHUB_REPOSITORIES,
    {
      context: { silentErrors: true },
      fetchPolicy: 'network-only',
      skip: !project.githubInstalled,
      variables: { projectId: project.id },
    },
  );

  // Sends the browser to GitHub. Anything it needs on the way back is saved first.
  const redirectTo = useCallback(
    async (query: UrlQuery, field: string) => {
      const result = await client.query<Record<string, string>>({
        context: { silentErrors: true },
        fetchPolicy: 'network-only',
        query,
        variables: { projectId: project.id },
      });
      if (result.error) {
        throw result.error;
      }
      const url = result.data?.[field];
      if (!url) {
        return;
      }
      sessionStorage.setItem(
        GITHUB_INSTALL_STATE_KEY,
        new URL(url).searchParams.get('state') ?? '',
      );
      window.location.assign(url);
    },
    [client, project.id],
  );

  return {
    connectRepository: (repoFullName: string) =>
      mutate(CONNECT_GITHUB, { input: { projectId: project.id, repoFullName } }),
    // Install the GitHub App on an account or organization, choosing which repositories it can read.
    install: () => redirectTo(FETCH_GITHUB_INSTALL_URL, 'fetchGithubInstallUrl'),
    repositories: repositories.data?.allGithubRepositories ?? [],
    repositoriesError: repositories.error,
    repositoriesLoading: repositories.loading,
    scan: () =>
      mutate<{ scanCodebase: { message?: string | null; success: boolean } }>(SCAN_CODEBASE, {
        input: { projectId: project.id },
      }),
    // For an App that is already installed (say by an org owner): sign in and pick an installation.
    signIn: () => redirectTo(FETCH_GITHUB_AUTHORIZE_URL, 'fetchGithubAuthorizeUrl'),
  };
}
