import type { FocusEventHandler, ReactNode } from 'react';
import type { Country } from 'react-phone-number-input';

import type { InputSize } from '@/shared/ui/input';

export const PHONE_INPUT_SIZES = ['sm', 'md', 'lg', 'xl'] as const;

export type PhoneInputSize = InputSize;

export type { Country };

export interface PhoneInputProps {
  allowedCountries?: Country[];
  autoComplete?: string;
  className?: string;
  defaultCountry?: Country;
  defaultValue?: string;
  disabled?: boolean;
  error?: boolean;
  helperIcon?: ReactNode | null;
  helperText?: ReactNode;
  id?: string;
  name?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange?: (value: string | undefined) => void;
  onValidationChange?: (isValid: boolean) => void;
  placeholder?: string;
  required?: boolean;
  size?: PhoneInputSize;
  value?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

export type PhoneCountryOption = {
  divider?: boolean;
  label: string;
  value?: string;
};

export interface PhoneCountrySelectProps {
  'aria-label'?: string;
  disabled?: boolean;
  name?: string;
  onBlur?: FocusEventHandler<HTMLElement>;
  onChange: (country?: string) => void;
  onFocus?: FocusEventHandler<HTMLElement>;
  options: PhoneCountryOption[];
  readOnly?: boolean;
  value?: string;
}
