import { useQuery } from '@apollo/client/react';

import { FETCH_FINDINGS_SUMMARY } from '@/graphql/queries/findingQueries';
import { FETCH_COVERAGE } from '@/graphql/queries/projectQueries';

import type { Coverage, FindingsSummary } from '../types';

export function useProjectDashboard(projectId: string) {
  const options = {
    context: { silentErrors: true },
    fetchPolicy: 'cache-and-network' as const,
    variables: { projectId },
  };
  const coverage = useQuery<{ fetchCoverage?: Coverage | null }>(FETCH_COVERAGE, options);
  const summary = useQuery<{ fetchFindingsSummary?: FindingsSummary | null }>(
    FETCH_FINDINGS_SUMMARY,
    options,
  );

  return {
    coverage: coverage.data?.fetchCoverage ?? null,
    coverageError: coverage.error,
    loading: (coverage.loading && !coverage.data) || (summary.loading && !summary.data),
    summary: summary.data?.fetchFindingsSummary ?? null,
    summaryError: summary.error,
  };
}
