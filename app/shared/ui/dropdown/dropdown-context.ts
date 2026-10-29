import { createContext, useContext } from 'react';

import type { DropdownIndicator, DropdownItemSize } from './types';

export type DropdownContextValue = {
  highlightedValue: string | null;
  indicator?: DropdownIndicator;
  itemAs: 'div' | 'li';
  itemSize: DropdownItemSize;
  listId: string;
  onHighlight: (value: string) => void;
  onSelect: (value: string) => void;
  selectedValue?: string;
  selectedValues?: string[];
};

export const DropdownContext = createContext<DropdownContextValue | null>(null);

export function useDropdownContext() {
  return useContext(DropdownContext);
}
