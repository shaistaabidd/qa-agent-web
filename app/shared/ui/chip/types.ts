import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';

export const CHIP_SIZES = ['sm', 'lg'] as const;

export type ChipSize = (typeof CHIP_SIZES)[number];

export const CHIP_VARIANTS = ['default', 'input'] as const;

export type ChipVariant = (typeof CHIP_VARIANTS)[number];

export const CHIP_INTERACTIONS = ['default', 'hover', 'selected'] as const;

export type ChipInteraction = (typeof CHIP_INTERACTIONS)[number];

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  count?: ReactNode;
  interaction?: ChipInteraction;
  leftAdornment?: ReactNode;
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
  removeLabel?: string;
  rightIcon?: ReactNode;
  selected?: boolean;
  size?: ChipSize;
  variant?: ChipVariant;
}
