import type { ReactNode, Ref, TextareaHTMLAttributes } from 'react';

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoHeight?: boolean;
  error?: boolean;
  helperIcon?: ReactNode | null;
  helperText?: ReactNode;
  ref?: Ref<HTMLTextAreaElement>;
  resize?: boolean;
  size?: TextareaSize;
}
