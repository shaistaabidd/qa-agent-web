import { cn } from '@/shared/lib/utils';

import type { PinColumnMeta } from './tanStackTableTypes';

export const headerCellClass =
  'sticky top-0 z-(--z-sticky) h-[40px] border-b border-subtle bg-bg-surface px-[16px] text-left align-middle text-label-sm text-fg-secondary';

export const bodyCellClass =
  'h-[48px] border-b border-subtle bg-transparent px-[16px] text-left align-middle text-body-base text-fg-default';

/** Pinned body cells are opaque, so columns scrolling underneath do not show through. */
export const pinnedBodyCellClass = 'bg-bg-surface';

/** Hairline on a start-pinned cell so scrolled columns do not blend into it. */
export const pinnedStartEdgeClass = 'shadow-[1px_0_0_0_var(--border-color-subtle)]';

export function alignClass(align: PinColumnMeta['align']): string {
  if (align === 'right') return 'text-right';
  if (align === 'center') return 'text-center';
  return 'text-left';
}

export function headerBorderClass(showVerticalLines: boolean, isFirstOfFirstRow: boolean): string {
  if (!showVerticalLines) return '';
  return cn('border-l border-subtle', isFirstOfFirstRow && 'border-l-0');
}

export function bodyBorderClass(showVerticalLines: boolean, isFirst: boolean): string {
  return showVerticalLines && !isFirst ? 'border-l border-subtle' : '';
}
