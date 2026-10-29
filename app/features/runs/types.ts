export type RunStatus = 'BLOCKED' | 'COMPLETED' | 'FAILED' | 'QUEUED' | 'RUNNING';

export type Run = {
  createdAt: string;
  finishedAt?: string | null;
  id: string;
  roleName: string;
  scopeFeature: { id: string; name: string };
  startedAt?: string | null;
  status: RunStatus;
};

export type AuditLogEntry = {
  actionTaken: string;
  createdAt: string;
  id: string;
  targetElement?: string | null;
};

export type MemorySample = { heapMb?: number; listeners?: number; nodes?: number };

/** What the backend probe measured for one API call during the run. */
export type CallProbe = {
  allocatedObjects?: number;
  exceptions?: number;
  nPlusOne?: number;
  overlapped?: boolean;
  queries?: number;
  rssDeltaMb?: number;
  sqlMs?: number;
};

export type NetworkEntry = {
  at: string;
  durationMs?: number | null;
  label: string;
  page?: string;
  probe?: CallProbe | null;
  resourceType?: string;
  status: number;
  step?: string;
};

export type EndpointStat = {
  avgMs: number;
  count: number;
  label: string;
  maxMs: number;
  queries?: number;
  totalMs: number;
};

export type IsolatedStat = {
  allocatedObjects: number;
  durationMs: number;
  label: string;
  rssDeltaMb: number;
};

export type LeakCheck = {
  after?: MemorySample;
  before?: MemorySample;
  clicks: string[];
  page: string;
};

export type BackendJob = { durationMs: number; name: string; queries: number; status: string };

/** The worker's own summary of a run. Every part is optional: older runs recorded less. */
export type RunSummary = {
  apiCalls?: number;
  backend?: {
    exceptions: number;
    jobs?: BackendJob[];
    nPlusOne: number;
    sqlMs: number;
    sqlQueries: number;
  };
  browser?: string;
  clicks?: number;
  durationMs?: number;
  endpoints?: EndpointStat[];
  failedCalls?: number;
  findingsByCategory?: Record<string, number>;
  findingsBySeverity?: Record<string, number>;
  isolated?: IsolatedStat[];
  leakChecks?: LeakCheck[];
  memory?: (MemorySample & { page: string })[];
  pages?: number;
};

export type RunDetail = Run & {
  auditLogEntries: AuditLogEntry[];
  networkLog: NetworkEntry[];
  summary: RunSummary;
};
