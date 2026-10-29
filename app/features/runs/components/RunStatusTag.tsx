import { Tag } from '@/shared/ui/tag';

import type { RunStatus } from '../types';
import { runStatusVariant } from '../utils';

export function RunStatusTag({ status }: { status: RunStatus }) {
  return (
    <Tag className="capitalize" variant={runStatusVariant(status)}>
      {status.toLowerCase()}
    </Tag>
  );
}
