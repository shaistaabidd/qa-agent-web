import type { InputHTMLAttributes, ReactNode } from 'react';

export type InputSize = 'sm' | 'md' | 'lg' | 'xl';

export type InputAdornmentAlign = 'start' | 'end';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: boolean;
  helperIcon?: ReactNode | null;
  helperText?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: InputSize;
}
