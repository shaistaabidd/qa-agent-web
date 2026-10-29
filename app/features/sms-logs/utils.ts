import type { CrudPageParams } from '@/shared/ui/crud';
import type { TagVariant } from '@/shared/ui/tag';

import {
  SMS_LOG_STATUS_LABELS,
  SMS_LOG_STATUS_VARIANTS,
  SMS_LOG_STATUSES,
  SMS_MESSAGE_TYPES,
} from './constants';
import type { SmsLog, SmsLogQueryFilter, SmsLogStatus, SmsLogUser, SmsMessageType } from './types';

export function smsLogStatusVariant(status: string): TagVariant {
  return isSmsLogStatus(status) ? SMS_LOG_STATUS_VARIANTS[status] : 'warning';
}

export function smsLogStatusLabel(status: string) {
  return isSmsLogStatus(status) ? SMS_LOG_STATUS_LABELS[status] : status;
}

export function isSmsLogStatus(value: string | undefined): value is SmsLogStatus {
  return (SMS_LOG_STATUSES as readonly string[]).includes(value ?? '');
}

export function isSmsMessageType(value: string | undefined): value is SmsMessageType {
  return (SMS_MESSAGE_TYPES as readonly string[]).includes(value ?? '');
}

export function smsLogUserLabel(user: SmsLogUser | null | undefined) {
  if (!user) {
    return 'N/A';
  }

  const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
  return name || user.email || 'N/A';
}

export function buildSmsLogQueryFilter(params: CrudPageParams): SmsLogQueryFilter {
  const filter: SmsLogQueryFilter = {
    page: params.page,
    perPage: params.pageSize,
  };
  const search = params.search.trim();
  const status = stringFilter(params.filters.status);
  const messageType = stringFilter(params.filters.messageType);
  const startDate = stringFilter(params.filters.startDate);
  const endDate = stringFilter(params.filters.endDate);

  if (search) {
    filter.search = search;
  }

  if (isSmsLogStatus(status)) {
    filter.status = status;
  }

  if (isSmsMessageType(messageType)) {
    filter.messageType = messageType;
  }

  if (startDate) {
    filter.startDate = startDate;
  }

  if (endDate) {
    filter.endDate = endDate;
  }

  return filter;
}

export function smsLogMatchesDetail(log: SmsLog | null, id: string | null) {
  return Boolean(log && id && log.id === id);
}

function stringFilter(value: unknown) {
  return typeof value === 'string' ? value : '';
}
