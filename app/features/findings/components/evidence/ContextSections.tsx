import type { LegacyColumnDef as ColumnDef } from '@tanstack/react-table/legacy';

import { formatDateTime } from '@/shared/lib/dates';
import { Table } from '@/shared/ui/table';

import type { Finding, FindingDetails } from '../../types';
import { pretty } from '../../utils';
import { CodeBlock, EvidenceSection, Facts } from './primitives';

type Crumb = NonNullable<FindingDetails['breadcrumbs']>[number];

const crumbColumns: ColumnDef<Crumb, unknown>[] = [
  {
    cell: ({ row }) => new Date(row.original.at).toLocaleTimeString(),
    enableSorting: false,
    header: 'Time',
    id: 'time',
  },
  { accessorKey: 'type', enableSorting: false, header: 'Type' },
  { accessorKey: 'message', enableSorting: false, header: 'Message' },
];

export function HistorySection({ finding }: { finding: Finding }) {
  if (finding.timesSeen == null) {
    return null;
  }

  return (
    <EvidenceSection title="Issue history">
      <Facts
        items={[
          ['Seen in', `${finding.timesSeen} run(s)`],
          ['First seen', formatDateTime(finding.firstSeenAt)],
          ['Last seen', formatDateTime(finding.lastSeenAt)],
          ['Status', finding.issueStatus],
        ]}
      />
    </EvidenceSection>
  );
}

export function StepsSection({ steps }: { steps: string[] }) {
  return (
    <EvidenceSection title="Steps to reproduce">
      {steps.length ? (
        <ol className="list-decimal pl-[20px]">
          {steps.map((step, index) => (
            <li key={`${index}-${step}`}>{step}</li>
          ))}
        </ol>
      ) : (
        <p className="text-fg-secondary">The worker recorded no steps.</p>
      )}
    </EvidenceSection>
  );
}

export function ContextSections({ details }: { details: FindingDetails }) {
  const { request } = details;

  return (
    <>
      {details.pages?.length ? (
        <EvidenceSection title={`Seen on ${details.pages.length} page(s)`}>
          <ul className="list-disc pl-[20px]">
            {details.pages.map((page) => (
              <li key={page}>{page}</li>
            ))}
          </ul>
        </EvidenceSection>
      ) : null}
      {request ? (
        <EvidenceSection title="Request">
          <CodeBlock>
            {pretty({
              durationMs: request.durationMs,
              method: request.method,
              operation: request.operationName || undefined,
              status: request.status,
              url: request.url,
              variables: request.variables,
            })}
          </CodeBlock>
          {details.samplesMs && details.samplesMs.length > 1 ? (
            <p className="text-fg-secondary">Durations seen: {details.samplesMs.join(', ')} ms</p>
          ) : null}
        </EvidenceSection>
      ) : null}
      {details.breadcrumbs?.length ? (
        <EvidenceSection title="Breadcrumbs (what happened before)">
          <Table
            columns={crumbColumns}
            data={details.breadcrumbs}
            getRowId={(_, index) => String(index)}
            pagination={false}
            showVerticalLines={false}
          />
        </EvidenceSection>
      ) : null}
    </>
  );
}

export function ScreenshotSection({ url }: { url: string | null | undefined }) {
  if (!url) {
    return null;
  }

  return (
    <EvidenceSection title="Screenshot">
      <a href={url} rel="noreferrer" target="_blank">
        <img
          alt="Screenshot of the page when the issue was found"
          className="w-full max-w-[480px] rounded-[8px] border border-low"
          loading="lazy"
          src={url}
        />
      </a>
    </EvidenceSection>
  );
}
