import { Tag } from '@/shared/ui/tag';

import type { Finding } from '../types';
import { IssueStatusTag, SeverityTag, SourceTag } from './Tags';

export function FindingSummaryTags({ finding }: { finding: Finding }) {
  const { details } = finding;

  return (
    <div className="flex flex-wrap items-center gap-[8px]">
      <SeverityTag severity={finding.severity} />
      <SourceTag source={finding.source} />
      {finding.category ? <Tag className="capitalize">{finding.category}</Tag> : null}
      {finding.issueStatus ? <IssueStatusTag status={finding.issueStatus} /> : null}
      {details?.handled === false ? <Tag variant="error">unhandled</Tag> : null}
      {details?.handled === true ? <Tag variant="warning">handled (swallowed)</Tag> : null}
      {details?.occurrences && details.occurrences > 1 ? (
        <Tag>{details.occurrences}× in this run</Tag>
      ) : null}
      {details?.type ? (
        <span className="text-fg-secondary">{details.type.replace(/_/g, ' ')}</span>
      ) : null}
      {details?.location ? <code>{details.location}</code> : null}
    </div>
  );
}
