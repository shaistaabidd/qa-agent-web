export type Severity = 'CRITICAL' | 'HIGH' | 'LOW' | 'MEDIUM';
export type FindingSource = 'BACKEND' | 'FRONTEND' | 'NETWORK';
export type IssueStatus = 'new' | 'ongoing' | 'regressed' | 'resolved';

/** One finding as a list row. Issue stats are only filled in on the grouped (issues) list. */
export type FindingRow = {
  category?: string | null;
  clickupTaskId?: string | null;
  createdAt: string;
  firstSeenAt?: string | null;
  id: string;
  issueStatus?: IssueStatus | null;
  lastSeenAt?: string | null;
  runId: string;
  severity: Severity;
  source: FindingSource;
  timesSeen?: number | null;
  title: string;
};

type QueryEvidence = {
  caller?: string;
  count?: number;
  max_ms?: number;
  ms?: number;
  sample?: string;
  sql?: string;
  suggestion?: string;
  total_ms?: number;
};

type BackendEvidence = {
  db?: { cached?: number; queries: number; total_ms: number };
  durationMs?: number;
  kind?: string;
  memory?: {
    allocated_objects?: number;
    gc_runs?: number;
    rss_after_mb?: number;
    rss_before_mb?: number;
    rss_delta_mb?: number;
  };
  name: string;
  status?: number | string;
  topQueries?: { caller?: string; count: number; sql: string; total_ms: number }[];
};

type Heap = { heapMb?: number; listeners?: number; nodes?: number };

/** What the worker recorded for a finding. Free-form: each section renders only the keys it finds. */
export type FindingDetails = {
  backend?: BackendEvidence;
  backtrace?: string[];
  breadcrumbs?: { at: string; message: string; type: string }[];
  errorName?: string;
  excerpt?: string;
  extensions?: unknown;
  graphqlPath?: unknown;
  handled?: boolean;
  location?: string;
  memory?: Heap;
  memoryAfter?: Heap;
  memoryBefore?: Heap;
  message?: string;
  metrics?: {
    cls?: number;
    domContentLoadedMs?: number;
    lcpMs?: number;
    longTaskMs?: number;
    ttfbMs?: number;
  };
  occurrences?: number;
  pages?: string[];
  query?: QueryEvidence;
  request?: {
    durationMs?: number;
    method?: string;
    operationName?: string;
    status?: number;
    url?: string;
    variables?: unknown;
  };
  responseBody?: string;
  samplesMs?: number[];
  server?: {
    dbMs?: number;
    diagnosis?: string;
    otherMs?: number;
    queries?: number;
    totalMs?: number;
  };
  stack?: string;
  type?: string;
};

export type Finding = FindingRow & {
  details: FindingDetails;
  fingerprint?: string | null;
  reproSteps: string[];
  screenshotUrl?: string | null;
};

export type FindingFilters = {
  category: string;
  severity: string;
  source: string;
};
