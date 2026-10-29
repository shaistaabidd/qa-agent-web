import type { InputProps } from '@/shared/ui/input';

export type SearchProps = Omit<
  InputProps,
  'defaultValue' | 'leftIcon' | 'onChange' | 'rightIcon' | 'type' | 'value'
> & {
  debounceMs?: number;
  param?: string;
};
