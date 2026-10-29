import type { InputHTMLAttributes, ReactNode } from 'react';

export type ChoiceCardType = 'checkbox' | 'radio' | 'switch';

export type ChoiceCardSize = 'large' | 'medium';

export type ChoiceCardInteraction = 'default' | 'hover';

export interface ChoiceCardProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'checked' | 'defaultChecked'
> {
  checked?: boolean;
  defaultChecked?: boolean;
  helperIcon?: ReactNode | null;
  helperText?: ReactNode;
  interaction?: ChoiceCardInteraction;
  onCheckedChange?: (checked: boolean) => void;
  size?: ChoiceCardSize;
  type?: ChoiceCardType;
}
