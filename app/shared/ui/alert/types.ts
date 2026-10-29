import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export const ALERT_VARIANTS = ['info', 'warning', 'error', 'success', 'neutral'] as const;

export type AlertVariant = (typeof ALERT_VARIANTS)[number];

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode | null;
  variant?: AlertVariant;
}

export interface AlertTitleProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export interface AlertDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export interface AlertActionProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface AlertCloseProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {}
