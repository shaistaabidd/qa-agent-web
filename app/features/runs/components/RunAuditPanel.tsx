import { ClipboardTextIcon } from '@phosphor-icons/react/ClipboardText';
import type { LegacyColumnDef as ColumnDef } from '@tanstack/react-table/legacy';

import { EmptyState } from '@/shared/ui/empty-state';
import { Table } from '@/shared/ui/table';

import type { AuditLogEntry } from '../types';

const columns: ColumnDef<AuditLogEntry, unknown>[] = [
  { accessorKey: 'actionTaken', enableSorting: false, header: 'Action' },
  {
    cell: ({ row }) => row.original.targetElement || '—',
    enableSorting: false,
    header: 'Element',
    id: 'target',
  },
  {
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleTimeString(),
    enableSorting: false,
    header: 'Time',
    id: 'time',
  },
];

export function RunAuditPanel({ entries }: { entries: AuditLogEntry[] }) {
  return (
    <Table
      columns={columns}
      data={entries}
      getRowId={(row) => row.id}
      locale={{
        emptyText: (
          <EmptyState
            icon={<ClipboardTextIcon aria-hidden weight="regular" />}
            size="md"
            subheading="The worker recorded no actions for this run."
            title="No audit log entries"
          />
        ),
      }}
      pagination={false}
      showVerticalLines={false}
    />
  );
}
