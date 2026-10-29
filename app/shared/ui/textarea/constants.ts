import { scrollbarClass } from '@/shared/lib/scrollbar';

import type { TextareaSize } from './types';

export const fieldClass = 'flex w-full min-w-0 flex-col gap-[8px]';

export const containerClass = [
  'relative box-border flex w-full min-w-0 cursor-text items-start overflow-hidden rounded-[12px] border border-default bg-bg-raised shadow-sm outline-none transition-colors',
  'hover:border-strong',
  'focus-within:border-focus focus-within:shadow-focus',
  'focus-within:hover:border-focus',
  'has-[textarea[readonly]]:border-subtle has-[textarea[readonly]]:bg-transparent has-[textarea[readonly]]:shadow-none',
  'has-[:disabled]:pointer-events-none has-[:disabled]:cursor-not-allowed has-[:disabled]:border-transparent has-[:disabled]:bg-bg-muted has-[:disabled]:shadow-none',
  'data-[invalid]:border-danger data-[invalid]:hover:border-danger',
  'data-[invalid]:focus-within:border-danger data-[invalid]:focus-within:hover:border-danger data-[invalid]:focus-within:shadow-focus-danger',
].join(' ');

export const radiusClass: Record<TextareaSize, string> = {
  sm: 'rounded-[12px]',
  md: 'rounded-[12px]',
  lg: 'rounded-[12px]',
};

export const containerSizeClass: Record<TextareaSize, string> = {
  sm: `h-[128px] ${radiusClass.sm}`,
  md: `h-[144px] ${radiusClass.md}`,
  lg: `h-[160px] ${radiusClass.lg}`,
};

export const textareaMinHeightPx: Record<TextareaSize, number> = {
  sm: 128,
  md: 144,
  lg: 160,
};

export const containerMinHeightClass: Record<TextareaSize, string> = {
  sm: 'min-h-[128px]',
  md: 'min-h-[144px]',
  lg: 'min-h-[160px]',
};

export const controlClass = [
  'h-full min-h-0 w-full min-w-0 flex-1 resize-none appearance-none border-0 bg-transparent font-body font-regular text-fg-default shadow-none outline-none placeholder:text-fg-secondary disabled:cursor-not-allowed disabled:text-fg-muted',
  scrollbarClass,
].join(' ');

export const controlSizeClass: Record<TextareaSize, string> = {
  sm: 'px-[12px] py-[8px] text-body-base',
  md: 'px-[12px] py-[8px] text-body-base',
  lg: 'px-[16px] py-[8px] text-body-lg',
};

export const resizableHostClass = 'relative w-fit max-w-full min-w-0 align-top';

// Browser resize grip shares the scrollbar corner, so this keeps the native grip.
export const resizableControlClass = [
  'box-border block w-[100cqi] max-w-[100cqi] min-w-[min(160px,100cqi)] cursor-text resize appearance-none overflow-auto rounded-[12px] border border-default bg-bg-raised font-body font-regular text-fg-default shadow-sm outline-none transition-colors placeholder:text-fg-secondary',
  'hover:border-strong',
  'focus:relative focus:border-focus focus:shadow-focus',
  'focus:hover:border-focus',
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:resize-none disabled:border-transparent disabled:bg-bg-muted disabled:text-fg-muted disabled:shadow-none',
  'data-[invalid]:border-danger data-[invalid]:hover:border-danger',
  'data-[invalid]:focus:border-danger data-[invalid]:focus:hover:border-danger data-[invalid]:focus:shadow-focus-danger',
].join(' ');
