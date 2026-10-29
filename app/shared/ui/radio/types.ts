import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export type RadioCheck = 'off' | 'on';

export type RadioPlacement = 'left' | 'right';

export type RadioInteraction = 'default' | 'hover' | 'pressed';

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'checked' | 'defaultChecked'
> {
  bold?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  embedded?: boolean;
  description?: ReactNode;
  error?: boolean;
  helperIcon?: ReactNode | null;
  helperText?: ReactNode;
  hint?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  optional?: boolean;
  placement?: RadioPlacement;
}

export interface RadioGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  defaultValue?: string;
  disabled?: boolean;
  name?: string;
  onValueChange?: (value: string) => void;
  value?: string;
}
