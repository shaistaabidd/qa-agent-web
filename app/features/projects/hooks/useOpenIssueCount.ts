import { useQuery } from '@apollo/client/react';

import { FETCH_FINDINGS_SUMMARY } from '@/graphql/queries/findingQueries';

/** Open (unresolved) issues, for the count on the Issues tab. Runs finish in the background, so it refreshes. */
export function useOpenIssueCount(projectId: string) {
  const { data } = useQuery<{ fetchFindingsSummary?: { total: number } | null }>(
    FETCH_FINDINGS_SUMMARY,
    { context: { silentErrors: true }, fetchPolicy: 'cache-and-network', variables: { projectId } },
  );

  return data?.fetchFindingsSummary?.total ?? 0;
}
