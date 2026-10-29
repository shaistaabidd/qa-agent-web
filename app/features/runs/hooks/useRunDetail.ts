import { useQuery } from '@apollo/client/react';
import { useEffect } from 'react';
import { useParams } from 'react-router';

import { FETCH_RUN } from '@/graphql/queries/runQueries';

import { ACTIVE_RUN_STATUSES, RUNS_POLL_MS } from '../constants';
import type { RunDetail } from '../types';

export function useRunDetail() {
  const { runId } = useParams();

  const { data, error, loading, startPolling, stopPolling } = useQuery<{
    fetchRun?: RunDetail | null;
  }>(FETCH_RUN, {
    context: { silentErrors: true },
    fetchPolicy: 'cache-and-network',
    skip: !runId,
    variables: { id: runId },
  });

  const run = data?.fetchRun ?? null;
  const active = run ? ACTIVE_RUN_STATUSES.includes(run.status) : false;

  useEffect(() => {
    if (active) {
      startPolling(RUNS_POLL_MS);
    } else {
      stopPolling();
    }
    return stopPolling;
  }, [active, startPolling, stopPolling]);

  return { error, loading: loading && !data, run };
}
