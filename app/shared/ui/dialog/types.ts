import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export type DialogSize = 'sm' | 'md' | 'lg';

export type DialogMediaVariant = 'icon' | 'avatar' | 'banner';

export type DialogMediaTone = 'danger' | 'info' | 'success' | 'warning';

export interface DialogProps {
  children: ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

export interface DialogTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: ReactNode;
}

export interface DialogCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children?: ReactNode;
}

export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  closeDisabled?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  showCloseButton?: boolean;
  size?: DialogSize;
}

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface DialogHeaderTextProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export interface DialogBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  sticky?: boolean;
}

export interface DialogFooterActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface DialogMediaProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  tone?: DialogMediaTone;
  variant?: DialogMediaVariant;
}
