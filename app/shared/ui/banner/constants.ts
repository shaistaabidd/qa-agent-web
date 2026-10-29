import type { BannerVariant } from './types';

export const rootClass =
  'flex w-full items-center gap-[12px] border-b border-subtle px-[16px] py-[12px] text-left text-body-base text-fg-default';

export const variantClass: Record<BannerVariant, string> = {
  info: 'bg-bg-info-subtle',
  warning: 'bg-bg-warning-subtle',
  error: 'bg-bg-danger-subtle',
  success: 'bg-bg-success-subtle',
};

export const iconClass: Record<BannerVariant, string> = {
  info: 'text-fg-info',
  warning: 'text-fg-warning',
  error: 'text-fg-danger',
  success: 'text-fg-success',
};

export const iconWrapClass =
  'flex size-[20px] shrink-0 items-center justify-center overflow-clip [&>svg]:size-[20px]';

export const contentClass = 'flex min-w-0 flex-1 items-start gap-[8px]';

export const textClass = 'flex min-w-0 flex-1 flex-col';

export const titleClass = 'text-fg-default';

export const descriptionClass = 'text-fg-default';

export const actionClass = 'flex shrink-0 items-center gap-[4px]';
