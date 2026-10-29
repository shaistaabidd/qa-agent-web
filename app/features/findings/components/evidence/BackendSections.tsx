import type { LegacyColumnDef as ColumnDef } from '@tanstack/react-table/legacy';

import { Table } from '@/shared/ui/table';

import type { FindingDetails } from '../../types';
import { CodeBlock, EvidenceSection, Facts } from './primitives';

type TopQuery = NonNullable<NonNullable<FindingDetails['backend']>['topQueries']>[number];

const topQueryColumns: ColumnDef<TopQuery, unknown>[] = [
  {
    cell: ({ row }) => (
      <span className="block max-w-[420px] truncate" title={row.original.sql}>
        {row.original.sql}
      </span>
    ),
    enableSorting: false,
    header: 'Query',
    id: 'sql',
  },
  { accessorKey: 'count', enableSorting: false, header: 'Count' },
  {
    cell: ({ row }) => `${row.original.total_ms} ms`,
    enableSorting: false,
    header: 'Total',
    id: 'total',
  },
  {
    cell: ({ row }) => row.original.caller || '—',
    enableSorting: false,
    header: 'From',
    id: 'caller',
  },
];

function QuerySection({ details }: { details: FindingDetails }) {
  const { query } = details;
  if (!query) {
    return null;
  }

  const slowest = query.max_ms ?? query.ms;

  return (
    <EvidenceSection title={details.type === 'n_plus_one' ? 'Repeated query (N+1)' : 'Query'}>
      <Facts
        items={[
          ['Runs', query.count != null ? `${query.count}×` : null],
          ['Total', query.total_ms != null ? `${query.total_ms} ms` : null],
          ['Slowest', slowest != null ? `${slowest} ms` : null],
          ['Called from', query.caller],
        ]}
      />
      <CodeBlock>{query.sample || query.sql}</CodeBlock>
      {query.suggestion ? <p>Fix: {query.suggestion}</p> : null}
    </EvidenceSection>
  );
}

function BackendSection({ details }: { details: FindingDetails }) {
  const { backend } = details;
  if (!backend) {
    return null;
  }

  const memory = backend.memory;

  return (
    <EvidenceSection
      title={`Backend ${backend.kind === 'job' ? 'job' : 'request'}: ${backend.name}`}
    >
      <Facts
        items={[
          ['Status', backend.status],
          ['Duration', backend.durationMs != null ? `${backend.durationMs} ms` : null],
          ['SQL', backend.db ? `${backend.db.queries} queries, ${backend.db.total_ms} ms` : null],
          ['Cached', backend.db?.cached],
          ['Allocated', memory?.allocated_objects?.toLocaleString()],
          [
            'RSS',
            memory?.rss_delta_mb != null
              ? `${memory.rss_before_mb} → ${memory.rss_after_mb} MB`
              : null,
          ],
          ['GC runs', memory?.gc_runs],
        ]}
      />
      {backend.topQueries?.length ? (
        <Table
          columns={topQueryColumns}
          data={backend.topQueries}
          getRowId={(_, index) => String(index)}
          pagination={false}
          showVerticalLines={false}
        />
      ) : null}
    </EvidenceSection>
  );
}

function ServerSection({ details }: { details: FindingDetails }) {
  const { server } = details;
  if (server?.totalMs == null) {
    return null;
  }

  return (
    <EvidenceSection title="Server time breakdown">
      <Facts
        items={[
          ['Total', `${server.totalMs} ms`],
          ['Database', server.dbMs != null ? `${server.dbMs} ms` : null],
          ['Queries', server.queries],
          ['Other', server.otherMs != null ? `${server.otherMs} ms` : null],
        ]}
      />
      {server.diagnosis ? <p className="text-fg-secondary">{server.diagnosis}</p> : null}
    </EvidenceSection>
  );
}

export function BackendSections({ details }: { details: FindingDetails }) {
  return (
    <>
      <QuerySection details={details} />
      <BackendSection details={details} />
      <ServerSection details={details} />
    </>
  );
}
