import type { HTMLAttributes } from 'react';

export const AVATAR_SIZES = ['16', '24', '32', '40', '48', '56', '80'] as const;

export type AvatarSize = (typeof AVATAR_SIZES)[number];

export type AvatarShape = 'circular' | 'rectangular';

export type AvatarTone = 'neutral' | 'brand';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  alt?: string;
  shape?: AvatarShape;
  size?: AvatarSize;
  src?: string;
  tone?: AvatarTone;
}
