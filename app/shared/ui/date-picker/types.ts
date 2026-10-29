import type { ReactNode } from 'react';

import type { InputSize } from '@/shared/ui/input';

export const DATE_PICKER_MODES = ['single', 'range'] as const;

export type DatePickerMode = (typeof DATE_PICKER_MODES)[number];

export const DATE_PICKER_MONTHS = [1, 2] as const;

export type DatePickerMonths = (typeof DATE_PICKER_MONTHS)[number];

export type DateRangeValue = {
  from?: Date;
  to?: Date;
};

type DatePickerSharedProps = {
  className?: string;
  defaultMonth?: Date;
  defaultOpen?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: ReactNode;
  id?: string;
  maxDate?: Date;
  minDate?: Date;
  months?: DatePickerMonths;
  name?: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  placeholder?: string;
  size?: InputSize;
};

export interface DatePickerSingleProps extends DatePickerSharedProps {
  defaultValue?: Date;
  mode?: 'single';
  onValueChange?: (value: Date | undefined) => void;
  value?: Date;
}

export interface DatePickerRangeProps extends DatePickerSharedProps {
  defaultValue?: DateRangeValue;
  mode: 'range';
  onValueChange?: (value: DateRangeValue) => void;
  value?: DateRangeValue;
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;
