import { scrollbarClass } from '@/shared/lib/scrollbar';

import type { SegmentedSize } from './types';

export const rootClass = [
  'relative isolate inline-flex max-w-full items-center overflow-x-auto overscroll-x-contain',
  'rounded-full bg-bg-muted p-[4px]',
  scrollbarClass,
].join(' ');

export const itemClass = [
  'relative z-0 inline-flex shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-full border-0',
  'bg-transparent font-body leading-none text-fg-default appearance-none outline-none',
  'transition-colors',
  'hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
  'active:bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))]',
  'data-[selected]:z-[1] data-[selected]:bg-bg-surface data-[selected]:shadow-sm',
].join(' ');

export const itemSizeClass: Record<SegmentedSize, string> = {
  sm: 'h-[24px] px-[8px] text-label-sm',
  default: 'h-[32px] px-[12px] text-label-base',
  lg: 'h-[40px] px-[16px] text-label-lg',
};

export const itemLiveClass = [
  'focus-visible:shadow-[inset_0_0_0_1px_var(--border-color-focus),0_0_0_4px_var(--color-state-focus)]',
  'data-[selected]:focus-visible:shadow-[inset_0_0_0_1px_var(--border-color-focus),0_0_0_4px_var(--color-state-focus)]',
].join(' ');

export const itemPreviewHoverClass =
  'bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]';

export const itemPreviewClass = 'pointer-events-none';

export const itemIconClass =
  'flex size-[20px] shrink-0 items-center overflow-clip [&_svg]:block [&_svg]:size-[20px] [&_svg]:shrink-0';

export const hiddenInputClass = 'hidden';
