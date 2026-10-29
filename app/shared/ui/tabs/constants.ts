import { scrollbarClass } from '@/shared/lib/scrollbar';

export const rootClass = `relative flex gap-[4px] overflow-x-auto overflow-y-hidden border-b border-subtle ${scrollbarClass}`;

export const rootFullWidthClass = 'w-full';

export const itemClass = [
  'group/tab relative inline-flex h-[40px] shrink-0 cursor-pointer items-center justify-center',
  'gap-[8px] rounded-t-[8px] border-0 bg-transparent px-[12px] font-body leading-none text-label-base text-fg-secondary',
  'appearance-none outline-none transition-colors',
  'after:pointer-events-none after:absolute after:inset-x-[12px] after:bottom-0 after:z-[1]',
  'after:h-0 after:rounded-full after:bg-bg-primary',
  'hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))] hover:text-fg-default',
  'active:bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))] active:text-fg-default',
  'data-[selected]:text-fg-default data-[selected]:after:h-[2px]',
].join(' ');

export const sizeClass = {
  default: '',
  sm: 'h-[32px] text-label-sm',
};

export const itemFillClass = 'min-w-0 flex-1 after:inset-x-0';

export const itemLiveClass =
  'focus-visible:shadow-[inset_0_0_0_1px_var(--border-color-focus),inset_0_0_0_4px_var(--color-state-focus)]';

export const itemPreviewClass = 'pointer-events-none';

export const innerClass = 'inline-flex items-center gap-[8px]';

export const itemIconClass =
  'flex size-[20px] shrink-0 items-center overflow-clip group-data-[selected]/tab:text-fg-default [&_svg]:block [&_svg]:size-[20px] [&_svg]:shrink-0';

export const hiddenInputClass = 'hidden';
