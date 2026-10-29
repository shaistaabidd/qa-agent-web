import type { InputHTMLAttributes, ReactNode } from 'react';

export type SwitchCheck = 'off' | 'on';

export type SwitchPlacement = 'left' | 'right';

export type SwitchInteraction = 'default' | 'hover' | 'pressed';

export interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'checked' | 'defaultChecked' | 'role'
> {
  bold?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  embedded?: boolean;
  description?: ReactNode;
  helperIcon?: ReactNode | null;
  helperText?: ReactNode;
  hint?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  optional?: boolean;
  placement?: SwitchPlacement;
}
