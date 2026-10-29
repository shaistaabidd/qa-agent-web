import { FolderSimpleIcon } from '@phosphor-icons/react/FolderSimple';
import type { LegacyColumnDef as ColumnDef } from '@tanstack/react-table/legacy';
import { Link } from 'react-router';

import { formatDateTime } from '@/shared/lib/dates';
import { EmptyState } from '@/shared/ui/empty-state';
import { Table } from '@/shared/ui/table';

import { projectPath } from '../constants';
import type { Project } from '../types';
import { GithubStatusTag } from './GithubStatusTag';

const columns: ColumnDef<Project, unknown>[] = [
  {
    cell: ({ row }) => (
      <Link
        className="font-medium text-fg-default hover:underline"
        to={projectPath(row.original.id)}
      >
        {row.original.name}
      </Link>
    ),
    enableSorting: false,
    header: 'Name',
    id: 'name',
    meta: { pin: 'left' },
  },
  { accessorKey: 'targetUrl', enableSorting: false, header: 'Target URL' },
  {
    cell: ({ row }) => <GithubStatusTag project={row.original} />,
    enableSorting: false,
    header: 'GitHub',
    id: 'github',
  },
  {
    cell: ({ row }) => formatDateTime(row.original.createdAt),
    enableSorting: false,
    header: 'Created',
    id: 'createdAt',
  },
];

type ProjectsTableProps = {
  loading: boolean;
  projects: Project[];
};

export function ProjectsTable({ loading, projects }: ProjectsTableProps) {
  return (
    <Table
      columns={columns}
      data={projects}
      getRowId={(row) => row.id}
      loading={loading}
      locale={{
        emptyText: (
          <EmptyState
            icon={<FolderSimpleIcon aria-hidden weight="regular" />}
            size="md"
            subheading="Create a project to connect a repository and start scanning it."
            title="No projects yet"
          />
        ),
      }}
      pagination={false}
      showVerticalLines={false}
    />
  );
}
