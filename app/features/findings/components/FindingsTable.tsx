import { BugIcon } from '@phosphor-icons/react/Bug';
import type { LegacyColumnDef as ColumnDef } from '@tanstack/react-table/legacy';
import { Link } from 'react-router';

import { EmptyState } from '@/shared/ui/empty-state';
import { Table } from '@/shared/ui/table';
import { Tag } from '@/shared/ui/tag';

import { issuePath } from '../constants';
import type { FindingRow } from '../types';
import { timeAgo } from '../utils';
import { IssueStatusTag, SeverityTag, SourceTag } from './Tags';

type FindingsTableProps = {
  findings: FindingRow[];
  grouped: boolean;
  loading: boolean;
  projectId: string;
};

export function FindingsTable({ findings, grouped, loading, projectId }: FindingsTableProps) {
  const columns: ColumnDef<FindingRow, unknown>[] = [
    {
      cell: ({ row }) => (
        <Link
          className="font-medium text-fg-default hover:underline"
          to={issuePath(projectId, row.original.id)}
        >
          {row.original.title}
        </Link>
      ),
      enableSorting: false,
      header: grouped ? 'Issue' : 'Finding',
      id: 'title',
      meta: { pin: 'left' },
    },
    {
      cell: ({ row }) => <SeverityTag severity={row.original.severity} />,
      enableSorting: false,
      header: 'Severity',
      id: 'severity',
    },
    {
      cell: ({ row }) => <SourceTag source={row.original.source} />,
      enableSorting: false,
      header: 'Source',
      id: 'source',
    },
    {
      cell: ({ row }) =>
        row.original.category ? <Tag className="capitalize">{row.original.category}</Tag> : '—',
      enableSorting: false,
      header: 'Category',
      id: 'category',
    },
    ...(grouped
      ? [
          {
            cell: ({ row }) =>
              row.original.issueStatus ? <IssueStatusTag status={row.original.issueStatus} /> : '—',
            enableSorting: false,
            header: 'Status',
            id: 'status',
          } satisfies ColumnDef<FindingRow, unknown>,
          {
            cell: ({ row }) => row.original.timesSeen ?? '—',
            enableSorting: false,
            header: 'Runs',
            id: 'timesSeen',
          } satisfies ColumnDef<FindingRow, unknown>,
        ]
      : []),
    {
      cell: ({ row }) => timeAgo(grouped ? row.original.lastSeenAt : row.original.createdAt),
      enableSorting: false,
      header: grouped ? 'Last seen' : 'Reported',
      id: 'seen',
    },
    {
      cell: ({ row }) => (row.original.clickupTaskId ? 'Posted' : '—'),
      enableSorting: false,
      header: 'ClickUp',
      id: 'clickup',
    },
  ];

  return (
    <Table
      columns={columns}
      data={findings}
      getRowId={(row) => row.id}
      loading={loading}
      locale={{
        emptyText: (
          <EmptyState
            icon={<BugIcon aria-hidden weight="regular" />}
            size="md"
            subheading={
              grouped
                ? 'Issues appear here once a run reports problems.'
                : 'Nothing broke during this run.'
            }
            title={grouped ? 'No issues' : 'No findings in this run'}
          />
        ),
      }}
      pagination={false}
      showVerticalLines={false}
    />
  );
}
