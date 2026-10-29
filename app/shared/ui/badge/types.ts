import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeVariant =
  | 'neutral'
  | 'primary'
  | 'primary-light'
  | 'rosy'
  | 'info'
  | 'info-light'
  | 'error'
  | 'error-light';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  dot?: boolean;
  size?: BadgeSize;
  variant?: BadgeVariant;
}
