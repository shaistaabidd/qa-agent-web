import type { TypographySize, TypographyVariant } from '@/shared/ui/Typography';

import type { AvatarSize, AvatarTone } from './types';

export const UNKNOWN_SRC = '/images/avatar/unknown.png';

export const rootClass =
  'inline-flex shrink-0 items-center justify-center overflow-clip select-none';

export const sizeClass: Record<AvatarSize, string> = {
  '16': 'size-[16px]',
  '24': 'size-[24px]',
  '32': 'size-[32px]',
  '40': 'size-[40px]',
  '48': 'size-[48px]',
  '56': 'size-[56px]',
  '80': 'size-[80px]',
};

export const rectangularRadiusClass: Record<AvatarSize, string> = {
  '16': 'rounded-[2px]',
  '24': 'rounded-[4px]',
  '32': 'rounded-[8px]',
  '40': 'rounded-[8px]',
  '48': 'rounded-[12px]',
  '56': 'rounded-[16px]',
  '80': 'rounded-[20px]',
};

export const imageClass = 'size-full object-cover';

export const toneClass: Record<AvatarTone, string> = {
  neutral: 'bg-bg-muted text-fg-default',
  brand: 'bg-bg-primary-subtle text-fg-primary',
};

export const unknownClass = 'bg-bg-muted';

export const initialsSize: Record<AvatarSize, TypographySize> = {
  '16': 'xxs',
  '24': 'sm',
  '32': 'base',
  '40': 'xl',
  '48': 'xl',
  '56': '2xl',
  '80': '2xl',
};

export const initialsVariant: Record<AvatarSize, TypographyVariant> = {
  '16': 'body2',
  '24': 'body2',
  '32': 'body2',
  '40': 'body2',
  '48': 'body2',
  '56': 'h5',
  '80': 'h5',
};
