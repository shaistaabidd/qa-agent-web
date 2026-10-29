import { Tag } from '@/shared/ui/tag';

import type { FindingSource, IssueStatus, Severity } from '../types';
import { issueStatusVariant, severityVariant, sourceVariant } from '../utils';

export function SeverityTag({ severity }: { severity: Severity }) {
  return (
    <Tag className="capitalize" variant={severityVariant(severity)}>
      {severity.toLowerCase()}
    </Tag>
  );
}

export function SourceTag({ source }: { source: FindingSource }) {
  return (
    <Tag className="capitalize" variant={sourceVariant(source)}>
      {source.toLowerCase()}
    </Tag>
  );
}

export function IssueStatusTag({ status }: { status: IssueStatus }) {
  return (
    <Tag className="capitalize" variant={issueStatusVariant(status)}>
      {status}
    </Tag>
  );
}
