import type {
  ComboboxGroupProps,
  ComboboxItemProps,
  ComboboxMultipleProps,
} from '@/shared/ui/combobox';

export type MultiSelectItemProps = ComboboxItemProps;

export type MultiSelectGroupProps = ComboboxGroupProps;

export type MultiSelectProps = Omit<ComboboxMultipleProps, 'multiple'>;
