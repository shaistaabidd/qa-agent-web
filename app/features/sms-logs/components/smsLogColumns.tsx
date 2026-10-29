import { formatDateTime } from '@/shared/lib/dates';
import type { CrudColumn } from '@/shared/ui/crud';

import { SMS_MESSAGE_TYPE_LABELS } from '../constants';
import type { SmsLog } from '../types';
import { smsLogUserLabel } from '../utils';
import { SmsLogStatusTag } from './SmsLogStatusTag';

export const SMS_LOG_COLUMNS: CrudColumn<SmsLog>[] = [
  {
    className: 'break-all',
    header: 'Recipient',
    key: 'recipient',
    pairWith: 'status',
  },
  {
    header: 'Message type',
    key: 'messageType',
    render: (row) => SMS_MESSAGE_TYPE_LABELS[row.messageType] || row.messageType,
  },
  {
    header: 'Status',
    key: 'status',
    mobileLabel: 'Status',
    render: (row) => <SmsLogStatusTag status={row.status} />,
  },
  {
    header: 'Sent at',
    key: 'sentAt',
    render: (row) => formatDateTime(row.sentAt),
  },
  {
    header: 'User',
    key: 'user',
    render: (row) => smsLogUserLabel(row.user),
  },
];
