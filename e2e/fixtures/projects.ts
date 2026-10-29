/** Builders for the QA domain: every field the app's queries select, so Apollo logs no "Missing field" warnings. */

export function buildProject(overrides: Record<string, unknown> = {}) {
  return {
    __typename: 'Project',
    createdAt: '2026-10-01T09:00:00Z',
    githubInstalled: false,
    id: 'project-1',
    myRole: 'ADMIN',
    name: 'Checkout app',
    repoConnected: false,
    repoFullName: null,
    targetUrl: 'https://staging.example.test',
    ...overrides,
  };
}

export function connection<T>(items: T[], overrides: Record<string, unknown> = {}) {
  return {
    count: items.length,
    nextPage: null,
    prevPage: null,
    totalPages: 1,
    ...overrides,
    allData: items,
  };
}

export function buildScopeFeature(overrides: Record<string, unknown> = {}) {
  return {
    __typename: 'ScopeFeature',
    approved: false,
    createdAt: '2026-10-01T09:00:00Z',
    id: 'feature-1',
    name: 'GET checkout',
    route: 'checkout',
    source: 'config/routes.rb',
    ...overrides,
  };
}

export function buildRun(overrides: Record<string, unknown> = {}) {
  return {
    __typename: 'Run',
    createdAt: '2026-10-01T09:00:00Z',
    finishedAt: null,
    id: 'run-1',
    roleName: 'admin',
    scopeFeature: { __typename: 'ScopeFeature', id: 'feature-1', name: 'GET checkout' },
    startedAt: null,
    status: 'QUEUED',
    ...overrides,
  };
}

export function buildRunDetail(overrides: Record<string, unknown> = {}) {
  return {
    ...buildRun({
      finishedAt: '2026-10-01T09:05:00Z',
      startedAt: '2026-10-01T09:00:00Z',
      status: 'COMPLETED',
    }),
    auditLogEntries: [
      {
        __typename: 'AuditLogEntry',
        actionTaken: 'clicked',
        createdAt: '2026-10-01T09:01:00Z',
        id: 'a1',
        targetElement: '#pay-button',
      },
    ],
    networkLog: [],
    summary: {
      apiCalls: 12,
      clicks: 4,
      durationMs: 300000,
      endpoints: [
        {
          avgMs: 1800,
          count: 3,
          label: 'GraphQL AllOrders',
          maxMs: 2200,
          queries: 40,
          totalMs: 5400,
        },
      ],
      failedCalls: 1,
      findingsBySeverity: { high: 1 },
      pages: 3,
    },
    ...overrides,
  };
}

export function buildFinding(overrides: Record<string, unknown> = {}) {
  return {
    __typename: 'Finding',
    category: 'error',
    clickupTaskId: null,
    createdAt: '2026-10-01T09:00:00Z',
    firstSeenAt: '2026-10-01T09:00:00Z',
    id: 'finding-1',
    issueStatus: 'new',
    lastSeenAt: '2026-10-01T09:00:00Z',
    runId: 'run-1',
    severity: 'HIGH',
    source: 'FRONTEND',
    timesSeen: 1,
    title: 'TypeError: x is undefined',
    ...overrides,
  };
}

export function buildFindingDetail(overrides: Record<string, unknown> = {}) {
  return {
    ...buildFinding(),
    details: { backtrace: ['app/models/order.rb:12'], stack: 'TypeError: x\n  at src/App.jsx:3:7' },
    fingerprint: 'js:x',
    reproSteps: ['Open /checkout', 'Click Pay'],
    screenshotUrl: null,
    ...overrides,
  };
}

export const EMPTY_SUMMARY = {
  bySeverity: [
    { count: 0, severity: 'LOW' },
    { count: 0, severity: 'MEDIUM' },
    { count: 0, severity: 'HIGH' },
    { count: 0, severity: 'CRITICAL' },
  ],
  pendingClickUp: 0,
  postedToClickUp: 0,
  resolved: 0,
  total: 0,
  totalFindings: 0,
};
