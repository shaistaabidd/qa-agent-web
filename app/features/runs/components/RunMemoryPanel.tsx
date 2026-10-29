import type { ReactNode } from 'react';

import { Typography } from '@/shared/ui/Typography';

import { LEAK_MB } from '../constants';
import type { NetworkEntry, RunSummary } from '../types';
import { serverMemoryRows } from '../utils';
import { JobsTable, LeakChecksTable, PageMemoryTable, ServerMemoryTable } from './MemoryTables';

function Section({ children, hint, title }: { children: ReactNode; hint?: string; title: string }) {
  return (
    <section className="flex flex-col gap-[8px]">
      <Typography as="h3" fontWeight="semibold" variant="body2">
        {title}
      </Typography>
      {hint ? <p className="text-fg-secondary">{hint}</p> : null}
      {children}
    </section>
  );
}

export function RunMemoryPanel({
  networkLog,
  summary,
}: {
  networkLog: NetworkEntry[];
  summary: RunSummary;
}) {
  const leakChecks = summary.leakChecks ?? [];
  const server = serverMemoryRows(summary, networkLog);
  const jobs = summary.backend?.jobs ?? [];

  return (
    <div className="flex flex-col gap-[24px]">
      <Section
        hint={`The page's clicks are repeated twice. Memory still growing after garbage collection (${LEAK_MB} MB or more) points to a leak.`}
        title="Browser: leak checks"
      >
        {leakChecks.length ? (
          <LeakChecksTable checks={leakChecks} />
        ) : (
          <p className="text-fg-secondary">No page had enough repeatable clicks to check.</p>
        )}
      </Section>
      <Section title="Browser: per page (on load, after garbage collection)">
        {summary.memory?.length ? (
          <PageMemoryTable samples={summary.memory} />
        ) : (
          <p className="text-fg-secondary">Memory is measured in Chromium-based browsers only.</p>
        )}
      </Section>
      <Section
        hint="Ruby objects allocated and process memory growth per request. Isolated means re-measured alone after the run; shared means other requests ran at the same time, so the numbers include their work."
        title="Server: per endpoint"
      >
        {server.length ? (
          <ServerMemoryTable rows={server} />
        ) : (
          <p className="text-fg-secondary">
            No server reports: the backend probe isn&apos;t enabled for this target.
          </p>
        )}
      </Section>
      {jobs.length > 0 ? (
        <Section title="Background jobs during the run">
          <JobsTable jobs={jobs} />
        </Section>
      ) : null}
    </div>
  );
}
