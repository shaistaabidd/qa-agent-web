import { scrollbarClass } from '@/shared/lib/scrollbar';

import type { DropdownItemSize, DropdownSize } from './types';

export const rootClass = 'relative flex w-full min-w-0 flex-col';

export const triggerClass = [
  'group/dropdown relative box-border flex w-full min-w-0 cursor-pointer items-center rounded-[12px] border border-default bg-bg-raised text-left shadow-sm outline-none transition-colors',
  'hover:border-strong',
  'focus-visible:border-focus focus-visible:shadow-focus',
  'data-[open]:border-focus data-[open]:shadow-focus',
  'data-[open]:hover:border-focus',
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-transparent disabled:bg-bg-muted disabled:shadow-none',
  'data-[loading]:cursor-wait',
  'data-[invalid]:border-danger data-[invalid]:hover:border-danger',
  'data-[invalid]:focus-visible:border-danger data-[invalid]:focus-visible:shadow-focus-danger',
  'data-[invalid]:data-[open]:border-danger data-[invalid]:data-[open]:shadow-focus-danger',
].join(' ');

export const triggerSizeClass: Record<DropdownSize, string> = {
  sm: 'h-[32px]',
  md: 'h-[40px]',
  lg: 'h-[48px]',
  xl: 'h-[56px]',
};

export const triggerValueClass =
  'h-auto min-w-0 flex-1 truncate font-body font-regular text-fg-default';

export const triggerValueSizeClass: Record<DropdownSize, string> = {
  sm: 'px-[12px] text-body-base',
  md: 'px-[12px] text-body-base',
  lg: 'px-[16px] text-body-lg',
  xl: 'px-[16px] text-body-lg',
};

export const triggerPlaceholderClass = 'text-fg-secondary';

export const triggerIconClass =
  'flex shrink-0 items-center justify-center self-stretch text-fg-secondary [&_svg]:pointer-events-none [&_svg]:shrink-0 group-disabled/dropdown:text-fg-muted';

export const triggerIconSizeClass: Record<DropdownSize, string> = {
  sm: 'pr-[12px] [&_svg]:size-[20px]',
  md: 'pr-[12px] [&_svg]:size-[20px]',
  lg: 'pr-[16px] [&_svg]:size-[20px]',
  xl: 'pr-[16px] [&_svg]:size-[20px]',
};

export const menuClass =
  'fixed z-(--z-dropdown) flex max-h-[280px] flex-col overflow-hidden rounded-[16px] border border-subtle bg-bg-elevated shadow-md';

export const menuListClass = [
  'flex min-h-0 w-full flex-1 flex-col overflow-x-hidden overflow-y-auto p-[4px]',
  scrollbarClass,
].join(' ');

export const itemClass =
  'flex w-full shrink-0 cursor-pointer items-center overflow-clip rounded-[8px] bg-transparent text-left outline-none';

export const itemLiveClass =
  'hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))] data-[highlighted]:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]';

export const itemPreviewHoverClass =
  'bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]';

export const itemDisabledClass = 'pointer-events-none cursor-not-allowed text-fg-muted';

export const itemTextClass =
  'flex min-w-0 flex-1 flex-col items-start justify-center whitespace-nowrap px-[12px] py-[8px]';

export const itemPrimaryVariant: Record<DropdownItemSize, 'body3'> = {
  lg: 'body3',
  sm: 'body3',
};

export const itemSupportingVariant: Record<DropdownItemSize, 'body3' | 'caption'> = {
  lg: 'body3',
  sm: 'caption',
};

export const itemLeftAdornmentClass =
  'ml-[12px] flex size-[20px] shrink-0 items-center justify-center overflow-hidden text-fg-secondary [&_svg]:block [&_svg]:size-[20px] [&_svg]:shrink-0';

export const itemRightAdornmentClass =
  'flex shrink-0 items-center justify-center py-[8px] pr-[12px] leading-none [&_svg]:block [&_svg]:shrink-0';

export const itemCheckClass = 'size-[16px] text-fg-default';

export const triggerSpinnerClass = 'animate-spin';

export const hiddenInputClass = 'hidden';

export const LOAD_MORE_THRESHOLD = 50;

export const MENU_OFFSET = 4;
export const MENU_VIEWPORT_PADDING = 8;
export const MENU_MAX_HEIGHT = 280;
