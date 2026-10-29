import { ArrowDownIcon } from '@phosphor-icons/react/ArrowDown';
import { ArrowsDownUpIcon } from '@phosphor-icons/react/ArrowsDownUp';
import { ArrowUpIcon } from '@phosphor-icons/react/ArrowUp';

import type { SortIconProps } from './tanStackTableTypes';

export function DEFAULT_SORT_ICON({ sortOrder }: SortIconProps) {
  if (sortOrder === 'ascend') {
    return <ArrowUpIcon aria-hidden className="size-[16px] text-current" weight="bold" />;
  }
  if (sortOrder === 'descend') {
    return <ArrowDownIcon aria-hidden className="size-[16px] text-current" weight="bold" />;
  }
  return (
    <ArrowsDownUpIcon aria-hidden className="size-[16px] text-fg-secondary" weight="regular" />
  );
}
