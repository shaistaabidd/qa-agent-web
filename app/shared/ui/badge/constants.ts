import type { BadgeSize, BadgeVariant } from './types';

export const baseClass = [
  'inline-flex w-max max-w-[min(100%,calc(8ch+8px))] shrink-0 items-center justify-center gap-[4px] box-border',
  'rounded-full',
  'font-body font-medium text-label-sm text-center whitespace-normal break-all select-none',
].join(' ');

export const sizeClass: Record<BadgeSize, string> = {
  sm: 'h-[20px] px-[8px]',
  md: 'h-[24px] px-[12px]',
};

export const variantClass: Record<BadgeVariant, string> = {
  neutral: 'bg-bg-muted text-fg-default',
  primary: 'bg-bg-primary-subtle text-fg-primary',
  'primary-light': 'bg-bg-primary-subtle text-fg-primary',
  rosy: 'bg-bg-muted text-fg-secondary',
  info: 'bg-bg-info-subtle text-fg-info',
  'info-light': 'bg-bg-info-subtle text-fg-info',
  error: 'bg-bg-danger-subtle text-fg-danger',
  'error-light': 'bg-bg-danger-subtle text-fg-danger',
};

export const dotClass = 'inline-block size-[12px] shrink-0 rounded-full';

export const dotVariantClass: Record<BadgeVariant, string> = {
  neutral: 'bg-fg-default',
  primary: 'bg-fg-primary',
  'primary-light': 'bg-fg-primary',
  rosy: 'bg-fg-secondary',
  info: 'bg-fg-info',
  'info-light': 'bg-fg-info',
  error: 'bg-fg-danger',
  'error-light': 'bg-fg-danger',
};
