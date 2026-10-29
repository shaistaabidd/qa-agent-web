import type { LegacyColumnDef as ColumnDef } from '@tanstack/react-table/legacy';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Table } from '@/shared/ui/table';

type Row = { id: string; name: string; status: string };

const rows: Row[] = [
  { id: '1', name: 'North Account', status: 'Active' },
  { id: '2', name: 'West Clinic', status: 'Pending' },
  { id: '3', name: 'Central Lab', status: 'Active' },
  { id: '4', name: 'East Account', status: 'Inactive' },
  { id: '5', name: 'South Clinic', status: 'Pending' },
  { id: '6', name: 'Harbor Lab', status: 'Active' },
];

const columns: ColumnDef<Row, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
];

const exampleClass = 'block w-full overflow-x-auto p-0';

export function TableSection() {
  return (
    <ComponentSection
      description="TanStack table wrapper used across list pages."
      id="table"
      title="Table"
    >
      <Example contentClassName={exampleClass} title="Sorting and pagination">
        <Table
          columns={columns}
          data={rows}
          getRowId={(row) => row.id}
          pagination={{ label: 'Table pagination', pageSize: 3 }}
        />
      </Example>
      <Example contentClassName={exampleClass} title="Loading">
        <Table columns={columns} data={rows.slice(0, 3)} loading pagination={false} />
      </Example>
      <Example contentClassName={exampleClass} title="Loading with no rows">
        <Table columns={columns} data={[]} loading pagination={false} />
      </Example>
    </ComponentSection>
  );
}
