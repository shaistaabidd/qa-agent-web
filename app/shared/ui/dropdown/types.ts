import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';

export type DropdownSize = 'sm' | 'md' | 'lg' | 'xl';

export type DropdownItemSize = 'sm' | 'lg';

export type DropdownItemInteraction = 'default' | 'hover';

/** `check` = checkmark on the right (default). `radio` = radio control on the left. */
export type DropdownIndicator = 'check' | 'radio';

export interface DropdownItemMeta {
  disabled?: boolean;
  label: ReactNode;
  value: string;
}

export interface DropdownItemProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  interaction?: DropdownItemInteraction;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: DropdownItemSize;
  supportingText?: ReactNode;
  value?: string;
}

export interface DropdownProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'onChange' | 'size'
> {
  children: ReactNode;
  /** Fixed menu width in px. Defaults to the trigger width, or content width for custom triggers. */
  contentWidth?: number;
  defaultOpen?: boolean;
  defaultValue?: string;
  error?: boolean;
  /** Selection glyph in the menu. Defaults to `check`. */
  indicator?: DropdownIndicator;
  itemSize?: DropdownItemSize;
  loading?: boolean;
  loadingMore?: boolean;
  name?: string;
  onLoadMore?: () => void;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string) => void;
  open?: boolean;
  placeholder?: string;
  query?: string;
  size?: DropdownSize;
  /** Custom trigger (e.g. Chip). Falls back to the input-styled button. */
  trigger?: ReactElement;
  value?: string;
}
