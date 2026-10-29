import { CaretRightIcon } from '@phosphor-icons/react/CaretRight';
import { PlayIcon } from '@phosphor-icons/react/Play';
import type { LegacyColumnDef as ColumnDef } from '@tanstack/react-table/legacy';
import { Link } from 'react-router';

import { formatDateTime } from '@/shared/lib/dates';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { Table } from '@/shared/ui/table';
import { Tooltip } from '@/shared/ui/tooltip';

import { runPath } from '../constants';
import type { Run } from '../types';
import { RunStatusTag } from './RunStatusTag';

export function RunsTable({
  loading,
  projectId,
  runs,
}: {
  loading: boolean;
  projectId: string;
  runs: Run[];
}) {
  const columns: ColumnDef<Run, unknown>[] = [
    {
      cell: ({ row }) => (
        <Link
          className="font-medium text-fg-default hover:underline"
          to={runPath(projectId, row.original.id)}
        >
          {row.original.scopeFeature.name}
        </Link>
      ),
      enableSorting: false,
      header: 'Scope feature',
      id: 'scopeFeature',
    },
    { accessorKey: 'roleName', enableSorting: false, header: 'Role' },
    {
      cell: ({ row }) => <RunStatusTag status={row.original.status} />,
      enableSorting: false,
      header: 'Status',
      id: 'status',
    },
    {
      cell: ({ row }) => formatDateTime(row.original.startedAt) || '—',
      enableSorting: false,
      header: 'Started',
      id: 'startedAt',
    },
    {
      cell: ({ row }) => formatDateTime(row.original.finishedAt) || '—',
      enableSorting: false,
      header: 'Finished',
      id: 'finishedAt',
    },
    {
      cell: ({ row }) => (
        <Tooltip content="View run">
          <Button asChild aria-label="View run" size="icon-sm" variant="ghost">
            <Link to={runPath(projectId, row.original.id)}>
              <CaretRightIcon aria-hidden weight="regular" />
            </Link>
          </Button>
        </Tooltip>
      ),
      enableSorting: false,
      header: 'Actions',
      id: 'actions',
      meta: { align: 'right' },
    },
  ];

  return (
    <Table
      columns={columns}
      data={runs}
      getRowId={(row) => row.id}
      loading={loading}
      locale={{
        emptyText: (
          <EmptyState
            icon={<PlayIcon aria-hidden weight="regular" />}
            size="md"
            subheading="Approve a scope feature, then dispatch a run."
            title="No runs yet"
          />
        ),
      }}
      pagination={false}
      showVerticalLines={false}
    />
  );
}
