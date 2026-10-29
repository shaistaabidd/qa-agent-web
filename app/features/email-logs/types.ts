export type EmailLogStatus = 'FAILED' | 'SUCCESS';

export type EmailLog = {
  attempts?: number;
  body?: string | null;
  createdAt: string;
  errorMessage?: string | null;
  id: string;
  mailer: string;
  mailerMethod: string;
  recipient: string;
  sentAt?: string | null;
  status: string;
  subject?: string | null;
  updatedAt: string;
};

export type EmailLogFilter = {
  endDate?: string;
  page: number;
  perPage: number;
  search?: string;
  startDate?: string;
  status?: EmailLogStatus;
};
