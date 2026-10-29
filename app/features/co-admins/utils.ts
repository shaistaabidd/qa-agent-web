import { toPhotoUrl } from '@/shared/lib/photoUrl';

import type { CoAdmin, CoAdminFormValues } from './types';

export function parseEmails(value: string) {
  return value
    .split(/[\s,;]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function coAdminLabel(row: Pick<CoAdmin, 'email' | 'fullName'>) {
  return row.fullName?.trim() || row.email;
}

export function coAdminPhotoUrl(row: Pick<CoAdmin, 'imageUrl'>) {
  return toPhotoUrl(row.imageUrl);
}

export function formatCoAdminDate(value: string | null | undefined) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function toFormValues(row: CoAdmin): CoAdminFormValues {
  return {
    firstName: row.firstName ?? '',
    lastName: row.lastName ?? '',
  };
}
