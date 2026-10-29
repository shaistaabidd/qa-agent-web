import { ListMagnifyingGlassIcon } from '@phosphor-icons/react/ListMagnifyingGlass';
import type { LegacyColumnDef as ColumnDef } from '@tanstack/react-table/legacy';
import { useMemo, useState } from 'react';

import { FilterDropdown } from '@/shared/lib/FilterDropdown';
import { EmptyState } from '@/shared/ui/empty-state';
import { Input } from '@/shared/ui/input';
import { Table } from '@/shared/ui/table';
import { Tag } from '@/shared/ui/tag';

import { MAX_LOG_ROWS, SLOW_MS } from '../constants';
import type { NetworkEntry } from '../types';
import { matchesLogFilter, pathOf } from '../utils';

const FILTER_OPTIONS = [
  { label: 'All calls', value: 'all' },
  { label: 'Errors (4xx/5xx)', value: 'errors' },
  { label: `Slow (≥ ${SLOW_MS} ms)`, value: 'slow' },
  { label: 'Backend issues (N+1, exceptions)', value: 'backend' },
];

function statusVariant(status: number) {
  if (status >= 500) {
    return 'error' as const;
  }
  return status >= 400 ? ('warning' as const) : ('success' as const);
}

const columns: ColumnDef<NetworkEntry, unknown>[] = [
  {
    cell: ({ row }) => new Date(row.original.at).toLocaleTimeString(),
    enableSorting: false,
    header: 'Time',
    id: 'time',
  },
  {
    cell: ({ row }) => (
      <>
        {row.original.label}
        {row.original.resourceType === 'document' ? ' (page)' : ''}
      </>
    ),
    enableSorting: false,
    header: 'Call',
    id: 'call',
  },
  {
    cell: ({ row }) => (
      <Tag variant={statusVariant(row.original.status)}>{row.original.status}</Tag>
    ),
    enableSorting: false,
    header: 'Status',
    id: 'status',
  },
  {
    cell: ({ row }) => {
      const ms = row.original.durationMs;
      if (ms == null) {
        return '—';
      }
      return (
        <span className={ms >= SLOW_MS ? 'font-semibold text-error' : undefined}>{ms} ms</span>
      );
    },
    enableSorting: false,
    header: 'Duration',
    id: 'duration',
  },
  {
    cell: ({ row }) =>
      row.original.probe ? `${row.original.probe.queries} q · ${row.original.probe.sqlMs} ms` : '—',
    enableSorting: false,
    header: 'SQL',
    id: 'sql',
  },
  {
    cell: ({ row }) => (
      <span className="flex gap-[4px]">
        {row.original.probe?.nPlusOne ? (
          <Tag variant="warning">N+1 ×{row.original.probe.nPlusOne}</Tag>
        ) : null}
        {row.original.probe?.exceptions ? (
          <Tag variant="error">{row.original.probe.exceptions} exception(s)</Tag>
        ) : null}
      </span>
    ),
    enableSorting: false,
    header: 'Backend',
    id: 'backend',
  },
  {
    cell: ({ row }) =>
      `${pathOf(row.original.page)}${row.original.step?.startsWith('Click') ? ` · ${row.original.step}` : ''}`,
    enableSorting: false,
    header: 'Page / step',
    id: 'page',
  },
];

export function RunApiLogPanel({ networkLog }: { networkLog: NetworkEntry[] }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const matching = useMemo(
    () => networkLog.filter((entry) => matchesLogFilter(entry, filter, search)),
    [filter, networkLog, search],
  );

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="flex flex-wrap items-center gap-[8px]">
        <div className="w-full max-w-[320px]">
          <Input
            aria-label="Search the API log"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search operation, page or step…"
            size="md"
            value={search}
          />
        </div>
        <FilterDropdown
          label="Filter calls"
          onChange={setFilter}
          options={FILTER_OPTIONS}
          value={filter}
        />
      </div>
      <Table
        columns={columns}
        data={matching.slice(0, MAX_LOG_ROWS)}
        getRowId={(row) => `${row.at}-${row.label}-${row.step ?? ''}-${row.status}`}
        locale={{
          emptyText: (
            <EmptyState
              icon={<ListMagnifyingGlassIcon aria-hidden weight="regular" />}
              size="md"
              subheading="Try a different search or filter."
              title="No matching calls"
            />
          ),
        }}
        pagination={false}
        showVerticalLines={false}
      />
      {matching.length > MAX_LOG_ROWS ? (
        <p className="text-fg-secondary">
          Showing the first {MAX_LOG_ROWS} of {matching.length} calls. Narrow the filter to see
          more.
        </p>
      ) : null}
    </div>
  );
}
