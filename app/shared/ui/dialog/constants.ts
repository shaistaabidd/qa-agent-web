import { scrollbarClass } from '@/shared/lib/scrollbar';

import type { DialogMediaVariant, DialogSize } from './types';

export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export const portalClass =
  'pointer-events-auto fixed inset-0 z-(--z-modal) flex items-center justify-center p-[16px]';

export const overlayClass = 'absolute inset-0 z-0 bg-bg-scrim';

export const contentClass =
  'group/dialog-content relative z-10 flex max-h-[calc(100vh-32px)] w-full flex-col overflow-hidden rounded-[24px] border border-subtle bg-bg-elevated text-fg-default shadow-md outline-none';

export const contentSizeClass: Record<DialogSize, string> = {
  sm: 'max-w-[400px]',
  md: 'max-w-[480px]',
  lg: 'max-w-[640px]',
};

export const closeButtonClass = 'absolute top-[16px] right-[16px] z-10';

export const headerClass =
  'relative flex shrink-0 items-start gap-[12px] p-[24px] pb-0 group-has-[[data-ui=dialog-close]]/dialog-content:pr-[56px]';

export const headerTextClass = 'flex min-w-0 flex-1 flex-col gap-[4px]';

export const bodyClass = [
  'flex min-h-0 flex-1 flex-col gap-[16px] overflow-y-auto px-[24px] py-[16px]',
  scrollbarClass,
].join(' ');

export const footerClass =
  'flex shrink-0 items-center justify-end gap-[8px] overflow-hidden px-[24px] pt-[16px] pb-[24px]';

export const footerDefaultClass = '';

export const footerStickyClass = 'border-t border-subtle bg-bg-canvas';

export const footerActionsClass = 'flex items-center gap-[8px]';

export const mediaClass: Record<DialogMediaVariant, string> = {
  icon: 'flex size-[40px] shrink-0 items-center justify-center overflow-clip rounded-full bg-bg-muted text-fg-default [&_svg]:size-[20px]',
  avatar: 'size-[48px] shrink-0 overflow-clip rounded-full [&_img]:size-full [&_img]:object-cover',
  banner:
    'w-full overflow-clip rounded-[16px] [&_img]:block [&_img]:size-full [&_img]:object-cover',
};

export const mediaToneClass: Record<string, string> = {
  danger: 'bg-bg-danger-subtle text-fg-danger',
  info: 'bg-bg-info-subtle text-fg-info',
  success: 'bg-bg-success-subtle text-fg-success',
  warning: 'bg-bg-warning-subtle text-fg-warning',
};
