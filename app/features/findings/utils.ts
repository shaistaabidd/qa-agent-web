import type { FindingSource, IssueStatus, Severity } from './types';

type TagVariant = 'default' | 'error' | 'info' | 'success' | 'warning';

export function severityVariant(severity: Severity): TagVariant {
  switch (severity) {
    case 'CRITICAL':
      return 'error';
    case 'HIGH':
      return 'warning';
    case 'MEDIUM':
      return 'info';
    default:
      return 'default';
  }
}

export function sourceVariant(source: FindingSource): TagVariant {
  switch (source) {
    case 'FRONTEND':
      return 'info';
    case 'BACKEND':
      return 'default';
    default:
      return 'warning';
  }
}

export function issueStatusVariant(status: IssueStatus): TagVariant {
  switch (status) {
    case 'new':
      return 'info';
    case 'regressed':
      return 'error';
    case 'resolved':
      return 'success';
    default:
      return 'default';
  }
}

export function timeAgo(iso: string | null | undefined) {
  if (!iso) {
    return '—';
  }

  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) {
    return 'just now';
  }
  if (minutes < 60) {
    return `${minutes} min ago`;
  }
  const hours = Math.round(minutes / 60);
  return hours < 24 ? `${hours} h ago` : new Date(iso).toLocaleDateString();
}

export function pretty(value: unknown) {
  return JSON.stringify(value, null, 2);
}
