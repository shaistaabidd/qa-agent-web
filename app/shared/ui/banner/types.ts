import type { HTMLAttributes, ReactNode } from 'react';

export const BANNER_VARIANTS = ['info', 'warning', 'error', 'success'] as const;

export type BannerVariant = (typeof BANNER_VARIANTS)[number];

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  action?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode | null;
  onAction?: () => void;
  onClose?: () => void;
  title: ReactNode;
  variant?: BannerVariant;
}
