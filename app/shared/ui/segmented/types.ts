import type { HTMLAttributes, ReactNode } from 'react';

export type SegmentedItemInteraction = 'default' | 'hover' | 'active';

export type SegmentedSize = 'sm' | 'default' | 'lg';

export interface SegmentedItemProps {
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
  interaction?: SegmentedItemInteraction;
  leftIcon?: ReactNode;
  value?: string;
}

export interface SegmentedProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  children: ReactNode;
  defaultValue?: string;
  name?: string;
  onValueChange?: (value: string) => void;
  size?: SegmentedSize;
  value?: string;
}
