import { useQuery } from '@apollo/client/react';
import { useState } from 'react';

import type { Connection } from '@/features/projects';
import { ALL_FINDINGS } from '@/graphql/queries/findingQueries';

import { ALL, EMPTY_FILTERS, FINDINGS_PER_PAGE } from '../constants';
import type { FindingFilters, FindingRow } from '../types';

const unlessAll = (value: string) => (value === ALL ? undefined : value);

/**
 * A project's issues (one row per fingerprint, with stats) or, with `runId`, every finding of that run.
 * Runs report in the background, so the list looks again each time it opens.
 */
export function useFindings(projectId: string, runId?: string) {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FindingFilters>(EMPTY_FILTERS);

  const { data, error, loading, refetch } = useQuery<{
    allFindings?: Connection<FindingRow> | null;
  }>(ALL_FINDINGS, {
    context: { silentErrors: true },
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: {
        category: unlessAll(filters.category),
        grouped: !runId,
        page,
        perPage: FINDINGS_PER_PAGE,
        runId,
        severity: unlessAll(filters.severity),
        source: unlessAll(filters.source),
      },
      projectId,
    },
  });

  const payload = data?.allFindings;
  const findings = payload?.allData ?? [];
  const count = payload?.count ?? findings.length;
  const showingFrom = count === 0 ? 0 : (page - 1) * FINDINGS_PER_PAGE + 1;

  return {
    count,
    error,
    filters,
    findings,
    grouped: !runId,
    loading: loading && !data,
    page,
    refetch,
    setFilter: (name: keyof FindingFilters, value: string) => {
      setFilters((current) => ({ ...current, [name]: value }));
      setPage(1);
    },
    setPage,
    showingFrom,
    showingTo: count === 0 ? 0 : showingFrom + findings.length - 1,
    totalPages: payload?.totalPages || 1,
  };
}
