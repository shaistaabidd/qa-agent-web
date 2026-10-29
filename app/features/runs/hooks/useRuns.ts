import { useQuery } from '@apollo/client/react';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useEffect } from 'react';

import type { Connection } from '@/features/projects';
import { ALL_RUNS } from '@/graphql/queries/runQueries';

import { ACTIVE_RUN_STATUSES, RUN_STATUS_OPTIONS, RUNS_PER_PAGE, RUNS_POLL_MS } from '../constants';
import type { Run, RunStatus } from '../types';

function isRunStatus(value: string): value is RunStatus {
  return RUN_STATUS_OPTIONS.some((option) => option.value === value && option.value !== 'all');
}

export function useRuns(projectId: string) {
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ history: 'replace' }),
  );
  const [status, setStatus] = useQueryState(
    'status',
    parseAsString.withDefault('all').withOptions({ history: 'replace' }),
  );

  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<{
    allRuns?: Connection<Run> | null;
  }>(ALL_RUNS, {
    context: { silentErrors: true },
    fetchPolicy: 'cache-and-network',
    variables: {
      filter: { page, perPage: RUNS_PER_PAGE, ...(isRunStatus(status) ? { status } : {}) },
      projectId,
    },
  });

  const payload = data?.allRuns;
  const runs = payload?.allData ?? [];
  const count = payload?.count ?? runs.length;
  const active = runs.some((run) => ACTIVE_RUN_STATUSES.includes(run.status));

  // Runs finish in the background, so keep looking while any is still queued or running.
  useEffect(() => {
    if (active) {
      startPolling(RUNS_POLL_MS);
    } else {
      stopPolling();
    }
    return stopPolling;
  }, [active, startPolling, stopPolling]);

  const showingFrom = count === 0 ? 0 : (page - 1) * RUNS_PER_PAGE + 1;

  return {
    count,
    error,
    loading: loading && !data,
    page,
    refetch,
    runs,
    setPage,
    setStatus: (next: string) => {
      void setStatus(next);
      void setPage(1);
    },
    showingFrom,
    showingTo: count === 0 ? 0 : showingFrom + runs.length - 1,
    status: isRunStatus(status) ? status : 'all',
    totalPages: payload?.totalPages || 1,
  };
}
