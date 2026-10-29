import type { EmailLogStatus } from './types';

export const EMAIL_LOGS_PATH = '/email-logs';
export const EMAIL_LOGS_PER_PAGE = 10;

export const EMAIL_LOG_STATUS_OPTIONS: {
  label: string;
  value: 'all' | EmailLogStatus;
}[] = [
  { label: 'All', value: 'all' },
  { label: 'Failed', value: 'FAILED' },
  { label: 'Success', value: 'SUCCESS' },
];

export function emailLogPath(id: string) {
  return `${EMAIL_LOGS_PATH}/${id}`;
}
