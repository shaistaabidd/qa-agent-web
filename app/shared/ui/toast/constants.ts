import type { CSSProperties } from 'react';

import type { ToastPosition, ToastStatusVariant } from './types';

export const TOAST_POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const satisfies readonly ToastPosition[];

export const iconWrapClass: Record<ToastStatusVariant, string> = {
  error: 'flex size-[20px] shrink-0 items-center justify-center',
  info: 'flex size-[20px] shrink-0 items-center justify-center',
  success: 'flex size-[20px] shrink-0 items-center justify-center',
};

export const toasterClass = 'toaster group';

export const toasterStyle = {
  '--normal-bg': 'var(--color-bg-elevated)',
  '--normal-text': 'var(--color-fg-default)',
  '--normal-border': 'var(--border-color-subtle)',
  '--border-radius': '16px',
  '--width': '360px',
  '--toast-close-button-start': 'unset',
  '--toast-close-button-end': '0px',
  '--toast-close-button-transform': 'none',
  fontFamily: 'var(--font-sans)',
} as CSSProperties;

export const toastClassNames = {
  toast:
    'items-start gap-[12px] border border-subtle bg-bg-elevated py-[12px] pr-[12px] pl-[16px] text-body-base text-fg-default shadow-md [&_[data-close-button]]:order-last [&_[data-close-button]]:static',
  title: 'font-medium text-label-base text-fg-default',
  description: 'text-body-sm text-fg-secondary mt-[2px]',
  icon: 'size-[20px]! h-[20px]! w-[20px]! m-0! mt-[2px]!',
  actionButton:
    'h-[32px]! rounded-full! border! border-default! bg-bg-raised! px-[12px]! py-0! text-label-sm! text-fg-default! shadow-sm! hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]!',
  closeButton:
    'static! inset-auto! left-auto! right-auto! top-auto! order-last! size-[32px]! transform-none! rounded-full! border-0! bg-transparent! text-fg-secondary! shadow-none! hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]! hover:text-fg-default!',
  default: 'rounded-[16px]',
};
