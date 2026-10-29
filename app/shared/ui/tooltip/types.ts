import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export const TOOLTIP_SIDES = ['top', 'bottom', 'left', 'right'] as const;

export type TooltipSide = (typeof TOOLTIP_SIDES)[number];

export interface TooltipProviderProps {
  children: ReactNode;
  delayDuration?: number;
}

export interface TooltipProps {
  children: ReactNode;
  content?: ReactNode;
  defaultOpen?: boolean;
  delayDuration?: number;
  disabled?: boolean;
  hideArrow?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  side?: TooltipSide;
  sideOffset?: number;
}

export interface TooltipTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: ReactNode;
}

export interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  hideArrow?: boolean;
  side?: TooltipSide;
  sideOffset?: number;
}
