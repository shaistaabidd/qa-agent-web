import type { InputHTMLAttributes, ReactNode } from 'react';

export type CheckboxChecked = boolean | 'indeterminate';

export type CheckboxPlacement = 'left' | 'right';

export type CheckboxCheck = 'off' | 'checked' | 'indeterminate';

export type CheckboxInteraction = 'default' | 'hover' | 'pressed';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'checked' | 'defaultChecked'
> {
  bold?: boolean;
  checked?: CheckboxChecked;
  defaultChecked?: boolean;
  embedded?: boolean;
  description?: ReactNode;
  error?: boolean;
  helperIcon?: ReactNode | null;
  helperText?: ReactNode;
  hint?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  optional?: boolean;
  placement?: CheckboxPlacement;
}
