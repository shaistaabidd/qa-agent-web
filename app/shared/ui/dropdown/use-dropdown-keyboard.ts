import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

import type { DropdownItemMeta } from './types';
import { findItemByTypedLetter } from './utils';

type DropdownKeyboardOptions = {
  disabled?: boolean;
  enabledItems: DropdownItemMeta[];
  highlightedValue: string | null;
  loading: boolean;
  moveHighlight: (delta: number) => void;
  open: boolean;
  select: (value: string) => void;
  setHighlightedValue: (value: string | null) => void;
  setOpen: (open: boolean) => void;
};

/** Trigger key handling shared by the dropdown and the combobox. */
export function useDropdownKeyboard({
  disabled,
  enabledItems,
  highlightedValue,
  loading,
  moveHighlight,
  open,
  select,
  setHighlightedValue,
  setOpen,
}: DropdownKeyboardOptions) {
  return function handleTriggerKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (disabled || loading) {
      return;
    }

    if (
      event.key === 'ArrowDown' ||
      event.key === 'ArrowUp' ||
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();

      if (!open) {
        setOpen(true);
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        if (highlightedValue) {
          select(highlightedValue);
        }
        return;
      }

      moveHighlight(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }

    if (!open) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setHighlightedValue(enabledItems[0]?.value ?? null);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      setHighlightedValue(enabledItems[enabledItems.length - 1]?.value ?? null);
      return;
    }

    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    event.preventDefault();
    const match = findItemByTypedLetter(enabledItems, event.key, highlightedValue);
    if (match) {
      setHighlightedValue(match);
    }
  };
}
