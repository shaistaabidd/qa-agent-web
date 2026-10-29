import type { ReactNode } from 'react';

import { Stat } from '@/shared/ui/stat';

import type { NetworkEntry, RunSummary } from '../types';
import { seconds, sumCounts } from '../utils';

const SEVERITY_ORDER = ['critical', 'high', 'medium', 'low'] as const;

function Tone({ bad, children }: { bad: boolean; children: ReactNode }) {
  return <span className={bad ? 'text-error' : undefined}>{children}</span>;
}

export function RunSummaryTiles({
  networkLog,
  summary,
}: {
  networkLog: NetworkEntry[];
  summary: RunSummary;
}) {
  const severities = summary.findingsBySeverity ?? {};
  const backend = summary.backend;
  const breakdown = SEVERITY_ORDER.filter((severity) => severities[severity])
    .map((severity) => `${severities[severity]} ${severity}`)
    .join(' · ');

  return (
    <div className="grid grid-cols-2 gap-[12px] md:grid-cols-3 xl:grid-cols-4">
      <Stat foot={summary.browser} label="Duration" value={seconds(summary.durationMs)} />
      <Stat
        foot={`${summary.clicks ?? 0} controls clicked`}
        label="Coverage"
        value={`${summary.pages ?? 0} pages`}
      />
      <Stat
        foot={`${summary.failedCalls ?? 0} failed`}
        label="API calls"
        value={
          <Tone bad={Boolean(summary.failedCalls)}>{summary.apiCalls ?? networkLog.length}</Tone>
        }
      />
      {backend ? (
        <>
          <Stat foot={`${backend.sqlMs} ms in database`} label="SQL" value={backend.sqlQueries} />
          <Stat
            label="N+1 patterns"
            value={<Tone bad={backend.nPlusOne > 0}>{backend.nPlusOne}</Tone>}
          />
          <Stat
            label="Backend exceptions"
            value={<Tone bad={backend.exceptions > 0}>{backend.exceptions}</Tone>}
          />
        </>
      ) : null}
      <Stat
        foot={breakdown || 'none'}
        label="Findings"
        value={<Tone bad={Boolean(severities.critical)}>{sumCounts(severities)}</Tone>}
      />
    </div>
  );
}
