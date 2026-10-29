import { ListChecksIcon } from '@phosphor-icons/react/ListChecks';
import type { LegacyColumnDef as ColumnDef } from '@tanstack/react-table/legacy';

import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { Table } from '@/shared/ui/table';
import { Tag } from '@/shared/ui/tag';

import type { ScopeFeature } from '../types';

type ScopeFeaturesTableProps = {
  approvingId: string | null;
  canApprove: boolean;
  features: ScopeFeature[];
  loading: boolean;
  onApprove: (id: string) => void;
};

export function ScopeFeaturesTable({
  approvingId,
  canApprove,
  features,
  loading,
  onApprove,
}: ScopeFeaturesTableProps) {
  const columns: ColumnDef<ScopeFeature, unknown>[] = [
    { accessorKey: 'name', enableSorting: false, header: 'Name' },
    {
      cell: ({ row }) => row.original.route || '—',
      enableSorting: false,
      header: 'Route',
      id: 'route',
    },
    {
      cell: ({ row }) => row.original.source || '—',
      enableSorting: false,
      header: 'Source',
      id: 'source',
    },
    {
      cell: ({ row }) =>
        row.original.approved ? (
          <Tag variant="success">Approved</Tag>
        ) : (
          <Tag variant="default">Pending</Tag>
        ),
      enableSorting: false,
      header: 'Status',
      id: 'status',
    },
    ...(canApprove
      ? [
          {
            cell: ({ row }) =>
              row.original.approved ? null : (
                <Button
                  disabled={approvingId !== null}
                  onClick={() => onApprove(row.original.id)}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {approvingId === row.original.id ? 'Approving…' : 'Approve'}
                </Button>
              ),
            enableSorting: false,
            header: 'Actions',
            id: 'actions',
            meta: { align: 'right' },
          } satisfies ColumnDef<ScopeFeature, unknown>,
        ]
      : []),
  ];

  return (
    <Table
      columns={columns}
      data={features}
      getRowId={(row) => row.id}
      loading={loading}
      locale={{
        emptyText: (
          <EmptyState
            icon={<ListChecksIcon aria-hidden weight="regular" />}
            size="md"
            subheading="Scan the codebase from the Overview tab to generate some."
            title="No scope features yet"
          />
        ),
      }}
      pagination={false}
      showVerticalLines={false}
    />
  );
}
