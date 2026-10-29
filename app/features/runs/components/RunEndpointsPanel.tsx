import { GaugeIcon } from '@phosphor-icons/react/Gauge';
import type { LegacyColumnDef as ColumnDef } from '@tanstack/react-table/legacy';

import { EmptyState } from '@/shared/ui/empty-state';
import { Table } from '@/shared/ui/table';

import { SLOW_MS } from '../constants';
import type { EndpointStat, RunSummary } from '../types';
import { isolatedByLabel } from '../utils';

export function RunEndpointsPanel({ summary }: { summary: RunSummary }) {
  const isolated = isolatedByLabel(summary);
  const hasBackend = Boolean(summary.backend);

  const columns: ColumnDef<EndpointStat, unknown>[] = [
    { accessorKey: 'label', enableSorting: false, header: 'Endpoint' },
    { accessorKey: 'count', enableSorting: false, header: 'Calls' },
    {
      cell: ({ row }) => {
        const slow = !isolated.has(row.original.label) && row.original.avgMs >= SLOW_MS;
        return (
          <span className={slow ? 'font-semibold text-error' : undefined}>
            {row.original.avgMs} ms
          </span>
        );
      },
      enableSorting: false,
      header: 'Avg',
      id: 'avg',
    },
    {
      cell: ({ row }) => `${row.original.maxMs} ms`,
      enableSorting: false,
      header: 'Max',
      id: 'max',
    },
    {
      cell: ({ row }) => `${row.original.totalMs} ms`,
      enableSorting: false,
      header: 'Total',
      id: 'total',
    },
    {
      cell: ({ row }) => {
        const alone = isolated.get(row.original.label);
        if (!alone) {
          return '—';
        }
        return (
          <span className={alone.durationMs >= SLOW_MS ? 'font-semibold text-error' : undefined}>
            {Math.round(alone.durationMs)} ms
          </span>
        );
      },
      enableSorting: false,
      header: 'Server alone',
      id: 'alone',
    },
    {
      cell: ({ row }) => (hasBackend ? (row.original.queries ?? '—') : '—'),
      enableSorting: false,
      header: 'SQL queries',
      id: 'queries',
    },
  ];

  return (
    <Table
      columns={columns}
      data={summary.endpoints ?? []}
      getRowId={(row) => row.label}
      locale={{
        emptyText: (
          <EmptyState
            icon={<GaugeIcon aria-hidden weight="regular" />}
            size="md"
            subheading="The worker recorded no requests for this run."
            title="No API calls recorded"
          />
        ),
      }}
      pagination={false}
      showVerticalLines={false}
    />
  );
}
