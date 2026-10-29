import type { FindingFilters } from './types';

export const FINDINGS_PER_PAGE = 10;
export const ALL = 'all';

export const EMPTY_FILTERS: FindingFilters = { category: ALL, severity: ALL, source: ALL };

export const SOURCE_OPTIONS = [
  { label: 'All sources', value: ALL },
  { label: 'Frontend', value: 'FRONTEND' },
  { label: 'Backend', value: 'BACKEND' },
  { label: 'Network', value: 'NETWORK' },
];

export const SEVERITY_OPTIONS = [
  { label: 'All severities', value: ALL },
  { label: 'Critical', value: 'CRITICAL' },
  { label: 'High', value: 'HIGH' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Low', value: 'LOW' },
];

export const CATEGORY_OPTIONS = [
  { label: 'All categories', value: ALL },
  ...['error', 'network', 'backend', 'performance', 'memory'].map((value) => ({
    label: value.charAt(0).toUpperCase() + value.slice(1),
    value,
  })),
];

export function issuePath(projectId: string, findingId: string) {
  return `/projects/${projectId}/issues/${findingId}`;
}
