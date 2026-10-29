import type { SMS_LOG_STATUSES, SMS_MESSAGE_TYPES } from './constants';

export type SmsLogStatus = (typeof SMS_LOG_STATUSES)[number];

export type SmsMessageType = (typeof SMS_MESSAGE_TYPES)[number];

export type SmsLogUser = {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
};

export type SmsLog = {
  body?: string | null;
  createdAt?: string | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  id: string;
  messageType: string;
  providerSid?: string | null;
  recipient: string;
  sentAt?: string | null;
  status: string;
  user?: SmsLogUser | null;
};

export type SmsLogListFilters = {
  endDate: string;
  messageType: string;
  startDate: string;
  status: string;
};

export type SmsLogQueryFilter = {
  endDate?: string;
  messageType?: string;
  page: number;
  perPage: number;
  search?: string;
  startDate?: string;
  status?: SmsLogStatus;
};
