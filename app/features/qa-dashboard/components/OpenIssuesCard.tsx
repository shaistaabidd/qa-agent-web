import { SeverityTag } from '@/features/findings';
import { Card, CardContent, CardHeader, CardHeaderText, CardTitle } from '@/shared/ui/card';
import { Stat } from '@/shared/ui/stat';

import type { FindingsSummary } from '../types';

export function OpenIssuesCard({
  error,
  summary,
}: {
  error?: Error;
  summary: FindingsSummary | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardHeaderText>
          <CardTitle>Open issues</CardTitle>
        </CardHeaderText>
      </CardHeader>
      <CardContent className="flex flex-col gap-[12px]">
        {error ? <p className="text-error">{error.message || 'Unable to load issues.'}</p> : null}
        {summary ? (
          <>
            <Stat label="Open" value={summary.total} />
            <ul className="flex flex-wrap gap-[12px]">
              {summary.bySeverity.map((row) => (
                <li className="flex items-center gap-[6px]" key={row.severity}>
                  <SeverityTag severity={row.severity} />
                  <span>{row.count}</span>
                </li>
              ))}
            </ul>
            <p className="text-fg-secondary">
              {summary.resolved} resolved · {summary.totalFindings} findings across all runs ·{' '}
              {summary.postedToClickUp} posted to ClickUp
            </p>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
