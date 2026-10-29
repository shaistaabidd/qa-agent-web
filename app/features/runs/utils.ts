import { BLOAT_OBJECTS, LEAK_MB, SLOW_MS } from './constants';
import type { EndpointStat, IsolatedStat, NetworkEntry, RunStatus, RunSummary } from './types';

type TagVariant = 'default' | 'error' | 'info' | 'success' | 'warning';

export function runStatusVariant(status: RunStatus): TagVariant {
  switch (status) {
    case 'RUNNING':
      return 'info';
    case 'BLOCKED':
      return 'warning';
    case 'COMPLETED':
      return 'success';
    case 'FAILED':
      return 'error';
    default:
      return 'default';
  }
}

export function seconds(ms: number | null | undefined) {
  return ms == null ? '—' : `${(ms / 1000).toFixed(1)} s`;
}

export function pathOf(url: string | undefined) {
  if (!url) {
    return '';
  }

  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

export function signed(delta: number) {
  const rounded = Math.round(delta * 10) / 10;
  return `${rounded >= 0 ? '+' : ''}${rounded}`;
}

export function growth(before: number | undefined, after: number | undefined) {
  return signed((after ?? 0) - (before ?? 0));
}

/** The time that counts for "slow": the isolated re-measurement when the call overlapped others, else its average. */
export function effectiveMs(endpoint: EndpointStat, isolated: Map<string, IsolatedStat>) {
  return isolated.get(endpoint.label)?.durationMs ?? endpoint.avgMs;
}

export function isolatedByLabel(summary: RunSummary) {
  return new Map((summary.isolated ?? []).map((row) => [row.label, row]));
}

export function isProblemCall(entry: NetworkEntry) {
  return entry.status >= 400 || Boolean(entry.probe?.nPlusOne) || Boolean(entry.probe?.exceptions);
}

export function sumCounts(counts: Record<string, number> | undefined) {
  return Object.values(counts ?? {}).reduce((total, count) => total + count, 0);
}

/** Counts for the run's tab labels: only things worth opening the tab for. */
export function runTabCounts(summary: RunSummary, networkLog: NetworkEntry[]) {
  const isolated = isolatedByLabel(summary);
  const leaked = (summary.leakChecks ?? []).some(
    (check) => (check.after?.heapMb ?? 0) - (check.before?.heapMb ?? 0) >= LEAK_MB * 4,
  );

  return {
    findings: sumCounts(summary.findingsBySeverity),
    memoryIssues: summary.findingsByCategory?.memory ?? 0,
    memoryTone: leaked ? ('error' as const) : ('warning' as const),
    problemCalls: networkLog.filter(isProblemCall).length,
    slowEndpoints: (summary.endpoints ?? []).filter(
      (endpoint) => effectiveMs(endpoint, isolated) >= SLOW_MS,
    ).length,
  };
}

export type ServerMemoryRow = {
  allocatedObjects: number;
  isolated: boolean;
  label: string;
  rssDeltaMb: number;
  shared: boolean;
};

/**
 * Server memory per endpoint: the isolated re-measurement when there is one (exact), otherwise the
 * largest reading seen during the run, flagged when other requests ran at the same time.
 */
export function serverMemoryRows(
  summary: RunSummary,
  networkLog: NetworkEntry[],
): ServerMemoryRow[] {
  const rows = new Map<string, ServerMemoryRow>();

  for (const entry of networkLog) {
    if (!entry.probe?.allocatedObjects) {
      continue;
    }
    const row = rows.get(entry.label) ?? {
      allocatedObjects: 0,
      isolated: false,
      label: entry.label,
      rssDeltaMb: 0,
      shared: false,
    };
    row.allocatedObjects = Math.max(row.allocatedObjects, entry.probe.allocatedObjects);
    row.rssDeltaMb = Math.max(row.rssDeltaMb, entry.probe.rssDeltaMb ?? 0);
    row.shared = row.shared || Boolean(entry.probe.overlapped);
    rows.set(entry.label, row);
  }

  for (const stat of summary.isolated ?? []) {
    rows.set(stat.label, {
      allocatedObjects: stat.allocatedObjects,
      isolated: true,
      label: stat.label,
      rssDeltaMb: stat.rssDeltaMb,
      shared: false,
    });
  }

  return [...rows.values()].sort((a, b) => b.allocatedObjects - a.allocatedObjects);
}

export function isBloated(row: ServerMemoryRow) {
  return row.allocatedObjects >= BLOAT_OBJECTS;
}

export function matchesLogFilter(entry: NetworkEntry, filter: string, search: string) {
  if (filter === 'errors' && entry.status < 400) {
    return false;
  }
  if (filter === 'slow' && !((entry.durationMs ?? 0) >= SLOW_MS)) {
    return false;
  }
  if (filter === 'backend' && !(entry.probe?.nPlusOne || entry.probe?.exceptions)) {
    return false;
  }

  const term = search.trim().toLowerCase();
  return !term || `${entry.label} ${entry.page} ${entry.step}`.toLowerCase().includes(term);
}
