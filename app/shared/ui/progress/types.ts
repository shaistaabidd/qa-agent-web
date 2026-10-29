import type { HTMLAttributes, ReactNode } from 'react';

import type { LabelDirection } from '@/shared/ui/label';

export const PROGRESS_TYPES = ['linear', 'circular'] as const;

export type ProgressType = (typeof PROGRESS_TYPES)[number];

export const PROGRESS_DIRECTIONS = ['horizontal', 'vertical'] as const;

export type ProgressDirection = (typeof PROGRESS_DIRECTIONS)[number];

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  direction?: ProgressDirection;
  label?: ReactNode;
  labelDescription?: ReactNode;
  labelDirection?: LabelDirection;
  max?: number;
  min?: number;
  type?: ProgressType;
  value?: number;
  valueLabel?: ReactNode;
  valueLabelDescription?: ReactNode;
  valueLabelDirection?: LabelDirection;
  valueLabelMuted?: boolean;
}
