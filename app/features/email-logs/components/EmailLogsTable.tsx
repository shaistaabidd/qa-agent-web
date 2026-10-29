import { CaretRightIcon } from '@phosphor-icons/react/CaretRight';
import { EnvelopeSimpleIcon } from '@phosphor-icons/react/EnvelopeSimple';
import type { LegacyColumnDef as ColumnDef } from '@tanstack/react-table/legacy';
import { useNavigate } from 'react-router';

import { formatDateTime } from '@/shared/lib/dates';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { Table } from '@/shared/ui/table';
import { Tooltip } from '@/shared/ui/tooltip';

import { emailLogPath } from '../constants';
import type { EmailLog } from '../types';
import { EmailLogStatusTag } from './EmailLogStatusTag';

const columns: ColumnDef<EmailLog, unknown>[] = [
  {
    accessorKey: 'recipient',
    enableSorting: false,
    header: 'Recipient',
    meta: { pin: 'left' },
  },
  {
    accessorKey: 'subject',
    enableSorting: false,
    header: 'Subject',
  },
  {
    cell: ({ row }) => <EmailLogStatusTag status={row.original.status} />,
    enableSorting: false,
    header: 'Status',
    id: 'status',
  },
  {
    cell: ({ row }) => formatDateTime(row.original.sentAt),
    enableSorting: false,
    header: 'Sent at',
    id: 'sentAt',
  },
  {
    accessorKey: 'mailer',
    enableSorting: false,
    header: 'Mailer',
  },
  {
    cell: ({ row }) => <EmailLogViewAction id={row.original.id} />,
    enableSorting: false,
    header: 'Actions',
    id: 'actions',
    meta: { align: 'right' },
  },
];

function EmailLogViewAction({ id }: { id: string }) {
  const navigate = useNavigate();

  return (
    <Tooltip content="View email log">
      <Button
        aria-label="View email log"
        onClick={() => navigate(emailLogPath(id))}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <CaretRightIcon aria-hidden weight="regular" />
      </Button>
    </Tooltip>
  );
}

type EmailLogsTableProps = {
  emailLogs: EmailLog[];
  loading: boolean;
};

export function EmailLogsTable({ emailLogs, loading }: EmailLogsTableProps) {
  return (
    <Table
      columns={columns}
      data={emailLogs}
      getRowId={(row) => row.id}
      loading={loading}
      locale={{
        emptyText: (
          <EmptyState
            icon={<EnvelopeSimpleIcon aria-hidden weight="regular" />}
            size="md"
            subheading="Try a different recipient, status, or date range."
            title="No email logs"
          />
        ),
      }}
      pagination={false}
      showVerticalLines={false}
    />
  );
}
