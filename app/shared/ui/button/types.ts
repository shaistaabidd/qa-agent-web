import type { ComponentProps, ReactNode } from 'react';

export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'link' | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export type ButtonIconSize = 'icon-sm' | 'icon-md' | 'icon-lg' | 'icon-xl';

export type ButtonSizeValue = ButtonSize | ButtonIconSize;

export interface ButtonProps extends ComponentProps<'button'> {
  asChild?: boolean;
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: ButtonSizeValue;
  variant?: ButtonVariant;
}
