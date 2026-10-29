import type { ReactNode } from 'react';

import type { DropdownItemProps, DropdownProps } from '@/shared/ui/dropdown';

export type ComboboxItemProps = DropdownItemProps;

export interface ComboboxGroupProps {
  children: ReactNode;
  label: ReactNode;
}

type ComboboxBaseProps = Omit<DropdownProps, 'defaultValue' | 'onValueChange' | 'value'> & {
  emptyText?: string;
  searchPlaceholder?: string;
  showClearAll?: boolean;
};

export interface ComboboxSingleProps extends ComboboxBaseProps {
  defaultValue?: string;
  multiple?: false;
  onValueChange?: (value: string) => void;
  showSelected?: never;
  value?: string;
}

export interface ComboboxMultipleProps extends ComboboxBaseProps {
  defaultValue?: string[];
  multiple: true;
  onValueChange?: (value: string[]) => void;
  showSelected?: boolean;
  value?: string[];
}

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;
