import type { HTMLAttributes, ReactNode } from 'react';

export const EMPTY_STATE_SIZES = ['md', 'lg'] as const;

export type EmptyStateSize = (typeof EMPTY_STATE_SIZES)[number];

export type EmptyStateVariant = 'default' | 'bordered';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  children?: ReactNode;
  icon: ReactNode;
  size?: EmptyStateSize;
  subheading: ReactNode;
  title: ReactNode;
  variant?: EmptyStateVariant;
}
