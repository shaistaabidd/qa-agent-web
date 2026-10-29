import type { TypographyVariant } from '@/shared/ui/Typography';

import type { EmptyStateSize } from './types';

export const rootClass: Record<EmptyStateSize, string> = {
  md: 'flex w-full flex-col items-center justify-center gap-[16px]',
  lg: [
    'flex min-h-0 w-full flex-1 flex-col items-center justify-center',
    'px-[24px] py-[48px]',
  ].join(' '),
};

export const frameClass: Record<EmptyStateSize, string> = {
  md: 'contents',
  lg: 'flex w-full max-w-[400px] flex-col items-center gap-[8px]',
};

export const iconClass: Record<EmptyStateSize, string> = {
  md: [
    'flex size-[80px] shrink-0 items-center justify-center overflow-clip rounded-full bg-bg-muted text-fg-secondary',
    '[&_img]:block [&_img]:size-[40px] [&_svg]:block [&_svg]:size-[40px]',
  ].join(' '),
  lg: [
    'flex size-[200px] shrink-0 items-center justify-center overflow-clip',
    '[&_img]:block [&_img]:size-[200px] [&_svg]:block [&_svg]:size-[200px]',
  ].join(' '),
};

export const bodyClass = 'flex w-full flex-col items-center gap-[24px]';

export const textClass: Record<EmptyStateSize, string> = {
  md: 'flex w-full flex-col text-center',
  lg: 'flex w-full flex-col gap-[4px] text-center',
};

export const titleVariant: Record<EmptyStateSize, TypographyVariant> = {
  md: 'body2',
  lg: 'h6',
};
