import type { TagVariant } from '@/shared/ui/tag';

export const SMS_LOGS_PATH = '/sms-logs';

/** Pending, or the status Twilio answered when the SMS was sent (SmsLogStatusEnum). */
export const SMS_LOG_STATUSES = ['PENDING', 'QUEUED', 'ACCEPTED', 'FAILED'] as const;

export const SMS_LOG_STATUS_LABELS: Record<(typeof SMS_LOG_STATUSES)[number], string> = {
  ACCEPTED: 'Accepted',
  FAILED: 'Failed',
  PENDING: 'Pending',
  QUEUED: 'Queued',
};

export const SMS_LOG_STATUS_VARIANTS: Record<(typeof SMS_LOG_STATUSES)[number], TagVariant> = {
  ACCEPTED: 'success',
  FAILED: 'error',
  PENDING: 'info',
  QUEUED: 'success',
};

export const SMS_LOG_STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  ...SMS_LOG_STATUSES.map((status) => ({ label: SMS_LOG_STATUS_LABELS[status], value: status })),
];

export const SMS_MESSAGE_TYPES = ['WELCOME'] as const;

export const SMS_MESSAGE_TYPE_LABELS: Record<string, string> = {
  WELCOME: 'Welcome',
};

export const SMS_MESSAGE_TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  ...SMS_MESSAGE_TYPES.map((type) => ({
    label: SMS_MESSAGE_TYPE_LABELS[type] ?? type,
    value: type,
  })),
];
