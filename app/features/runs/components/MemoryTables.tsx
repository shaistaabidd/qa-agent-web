import type { LegacyColumnDef as ColumnDef } from '@tanstack/react-table/legacy';

import { Table } from '@/shared/ui/table';
import { Tag } from '@/shared/ui/tag';

import { LEAK_MB } from '../constants';
import type { BackendJob, LeakCheck, MemorySample } from '../types';
import { growth, isBloated, type ServerMemoryRow, signed } from '../utils';

type PageSample = MemorySample & { page: string };

function SimpleTable<Row extends object>({
  columns,
  data,
  rowId,
}: {
  columns: ColumnDef<Row, unknown>[];
  data: Row[];
  rowId: (row: Row, index: number) => string;
}) {
  return (
    <Table
      columns={columns}
      data={data}
      getRowId={rowId}
      pagination={false}
      showVerticalLines={false}
    />
  );
}

const leakColumns: ColumnDef<LeakCheck, unknown>[] = [
  { accessorKey: 'page', enableSorting: false, header: 'Page' },
  {
    cell: ({ row }) => row.original.clicks.join(', '),
    enableSorting: false,
    header: 'Clicks repeated',
    id: 'clicks',
  },
  {
    cell: ({ row }) => {
      const { after, before } = row.original;
      const grew = (after?.heapMb ?? 0) - (before?.heapMb ?? 0) >= LEAK_MB;
      return (
        <span className={grew ? 'font-semibold text-error' : undefined}>
          {before?.heapMb} → {after?.heapMb} MB ({growth(before?.heapMb, after?.heapMb)})
        </span>
      );
    },
    enableSorting: false,
    header: 'JS heap',
    id: 'heap',
  },
  {
    cell: ({ row }) => `${row.original.before?.nodes} → ${row.original.after?.nodes}`,
    enableSorting: false,
    header: 'DOM nodes',
    id: 'nodes',
  },
  {
    cell: ({ row }) => `${row.original.before?.listeners} → ${row.original.after?.listeners}`,
    enableSorting: false,
    header: 'Listeners',
    id: 'listeners',
  },
];

export function LeakChecksTable({ checks }: { checks: LeakCheck[] }) {
  return <SimpleTable columns={leakColumns} data={checks} rowId={(_, index) => String(index)} />;
}

const pageColumns: ColumnDef<PageSample, unknown>[] = [
  { accessorKey: 'page', enableSorting: false, header: 'Page' },
  {
    cell: ({ row }) => `${row.original.heapMb} MB`,
    enableSorting: false,
    header: 'JS heap',
    id: 'heap',
  },
  { accessorKey: 'nodes', enableSorting: false, header: 'DOM nodes' },
  { accessorKey: 'listeners', enableSorting: false, header: 'Event listeners' },
];

export function PageMemoryTable({ samples }: { samples: PageSample[] }) {
  return <SimpleTable columns={pageColumns} data={samples} rowId={(_, index) => String(index)} />;
}

const serverColumns: ColumnDef<ServerMemoryRow, unknown>[] = [
  { accessorKey: 'label', enableSorting: false, header: 'Endpoint' },
  {
    cell: ({ row }) => (
      <span className={isBloated(row.original) ? 'font-semibold text-error' : undefined}>
        {row.original.allocatedObjects.toLocaleString()}
      </span>
    ),
    enableSorting: false,
    header: 'Objects allocated',
    id: 'objects',
  },
  {
    cell: ({ row }) => `${signed(row.original.rssDeltaMb)} MB`,
    enableSorting: false,
    header: 'Memory growth',
    id: 'growth',
  },
  {
    cell: ({ row }) =>
      row.original.isolated ? (
        <Tag variant="success">isolated</Tag>
      ) : row.original.shared ? (
        <Tag variant="warning">shared</Tag>
      ) : (
        <Tag variant="default">alone</Tag>
      ),
    enableSorting: false,
    header: 'Measurement',
    id: 'measurement',
  },
];

export function ServerMemoryTable({ rows }: { rows: ServerMemoryRow[] }) {
  return <SimpleTable columns={serverColumns} data={rows} rowId={(row) => row.label} />;
}

const jobColumns: ColumnDef<BackendJob, unknown>[] = [
  { accessorKey: 'name', enableSorting: false, header: 'Job' },
  { accessorKey: 'status', enableSorting: false, header: 'Status' },
  {
    cell: ({ row }) => `${row.original.durationMs} ms`,
    enableSorting: false,
    header: 'Duration',
    id: 'duration',
  },
  {
    cell: ({ row }) => `${row.original.queries} queries`,
    enableSorting: false,
    header: 'SQL',
    id: 'queries',
  },
];

export function JobsTable({ jobs }: { jobs: BackendJob[] }) {
  return <SimpleTable columns={jobColumns} data={jobs} rowId={(_, index) => String(index)} />;
}
