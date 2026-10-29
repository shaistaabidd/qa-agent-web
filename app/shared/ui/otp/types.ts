import type { FocusEventHandler, ReactNode } from 'react';

export const OTP_SIZES = ['sm', 'md', 'lg', 'xl'] as const;

export type OtpSize = (typeof OTP_SIZES)[number];

export interface OtpProps {
  autoFocus?: boolean;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  helperIcon?: ReactNode | null;
  helperText?: ReactNode;
  id?: string;
  name?: string;
  onBlur?: FocusEventHandler<HTMLDivElement>;
  onChange?: (value: string) => void;
  required?: boolean;
  size?: OtpSize;
  slots?: number;
  value?: string;
  defaultValue?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-label'?: string;
  'aria-labelledby'?: string;
}
