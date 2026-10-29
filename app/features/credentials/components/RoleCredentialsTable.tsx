import { KeyIcon } from '@phosphor-icons/react/Key';
import type { LegacyColumnDef as ColumnDef } from '@tanstack/react-table/legacy';

import { formatDateTime } from '@/shared/lib/dates';
import { EmptyState } from '@/shared/ui/empty-state';
import { Table } from '@/shared/ui/table';

import type { RoleCredential } from '../types';

const columns: ColumnDef<RoleCredential, unknown>[] = [
  { accessorKey: 'roleName', enableSorting: false, header: 'Role' },
  {
    cell: ({ row }) => formatDateTime(row.original.updatedAt),
    enableSorting: false,
    header: 'Last updated',
    id: 'updatedAt',
  },
];

export function RoleCredentialsTable({
  credentials,
  loading,
}: {
  credentials: RoleCredential[];
  loading: boolean;
}) {
  return (
    <Table
      columns={columns}
      data={credentials}
      getRowId={(row) => row.id}
      loading={loading}
      locale={{
        emptyText: (
          <EmptyState
            icon={<KeyIcon aria-hidden weight="regular" />}
            size="md"
            subheading="Add the sign-in the worker should use for a role, such as admin."
            title="No credentials configured yet"
          />
        ),
      }}
      pagination={false}
      showVerticalLines={false}
    />
  );
}
