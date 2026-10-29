import { createContext, useContext } from 'react';

export type ComboboxFilterContextValue = {
  query: string;
};

export const ComboboxFilterContext = createContext<ComboboxFilterContextValue | null>(null);

export function useComboboxFilter() {
  return useContext(ComboboxFilterContext);
}
