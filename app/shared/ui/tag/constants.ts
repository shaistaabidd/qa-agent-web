import type { TagSize, TagVariant } from './types';

export const baseClass = [
  'inline-flex w-fit shrink-0 items-center justify-center box-border',
  'gap-[4px] rounded-full font-body',
  'select-none',
].join(' ');

export const sizeClass: Record<TagSize, string> = {
  sm: 'h-[20px] px-[8px]',
  lg: 'h-[24px] px-[12px]',
};

export const variantClass: Record<TagVariant, string> = {
  default: 'bg-bg-muted text-fg-default',
  success: 'bg-bg-success-subtle text-fg-success',
  error: 'bg-bg-danger-subtle text-fg-danger',
  warning: 'bg-bg-warning-subtle text-fg-warning',
  info: 'bg-bg-info-subtle text-fg-info',
  custom: 'bg-bg-primary-subtle text-fg-primary',
};

export const dotClass: Record<TagSize, string> = {
  sm: 'size-[6px] shrink-0 rounded-full',
  lg: 'size-[6px] shrink-0 rounded-full',
};

export const dotVariantClass: Record<TagVariant, string> = {
  default: 'bg-fg-default',
  success: 'bg-fg-success',
  error: 'bg-fg-danger',
  warning: 'bg-fg-warning',
  info: 'bg-fg-info',
  custom: 'bg-fg-primary',
};

export const labelClass = 'inline-flex items-center justify-center';
