import type { HTMLAttributes, ReactNode } from 'react';

export const TAG_SIZES = ['sm', 'lg'] as const;

export type TagSize = (typeof TAG_SIZES)[number];

export const TAG_VARIANTS = ['default', 'success', 'error', 'warning', 'info', 'custom'] as const;

export type TagVariant = (typeof TAG_VARIANTS)[number];

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  showDot?: boolean;
  size?: TagSize;
  variant?: TagVariant;
}
