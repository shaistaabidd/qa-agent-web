import type { LabelHTMLAttributes, ReactNode } from 'react';

export type LabelDirection = 'vertical' | 'horizontal';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  as?: 'label' | 'span';
  bold?: boolean;
  children: ReactNode;
  description?: ReactNode;
  direction?: LabelDirection;
  disabled?: boolean;
  error?: boolean;
  hint?: boolean;
  hintIcon?: ReactNode;
  optional?: boolean;
  required?: boolean;
}
