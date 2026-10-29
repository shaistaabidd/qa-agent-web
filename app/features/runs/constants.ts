import type { RunStatus } from './types';

export const RUNS_PER_PAGE = 10;
export const RUNS_POLL_MS = 5000;

export const ACTIVE_RUN_STATUSES: RunStatus[] = ['QUEUED', 'RUNNING'];

export const RUN_STATUS_OPTIONS: { label: string; value: 'all' | RunStatus }[] = [
  { label: 'All statuses', value: 'all' },
  { label: 'Queued', value: 'QUEUED' },
  { label: 'Running', value: 'RUNNING' },
  { label: 'Blocked', value: 'BLOCKED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Failed', value: 'FAILED' },
];

/** A call at or over this is slow. */
export const SLOW_MS = 1000;
/** Browser heap growth over this after garbage collection points to a leak. */
export const LEAK_MB = 5;
/** A request that allocates this many Ruby objects is bloated. */
export const BLOAT_OBJECTS = 500_000;
/** The API log shows at most this many rows. */
export const MAX_LOG_ROWS = 300;

export const RUN_DETAIL_TABS = [
  { label: 'Findings', value: 'findings' },
  { label: 'Endpoints', value: 'endpoints' },
  { label: 'API log', value: 'api-log' },
  { label: 'Memory', value: 'memory' },
  { label: 'Audit log', value: 'audit' },
] as const;

export type RunDetailTab = (typeof RUN_DETAIL_TABS)[number]['value'];

export function runPath(projectId: string, runId: string) {
  return `/projects/${projectId}/runs/${runId}`;
}
