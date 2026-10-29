import { createContext, useContext } from 'react';

import type { TabsSize } from './types';

export type TabsContextValue = {
  fullWidth: boolean;
  id?: string;
  onValueChange: (value: string) => void;
  size: TabsSize;
  value?: string;
};

export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext() {
  return useContext(TabsContext);
}
