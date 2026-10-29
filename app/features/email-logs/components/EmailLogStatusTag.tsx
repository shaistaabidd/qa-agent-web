import { Tag } from '@/shared/ui/tag';

import { emailLogStatusVariant } from '../utils';

export function EmailLogStatusTag({ status }: { status: string }) {
  const label = status.toLowerCase();

  return (
    <Tag className="capitalize" variant={emailLogStatusVariant(status)}>
      {label}
    </Tag>
  );
}
