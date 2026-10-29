import { createContext, useContext } from 'react';

import type { SegmentedSize } from './types';

export type SegmentedContextValue = {
  onValueChange: (value: string) => void;
  size: SegmentedSize;
  value?: string;
};

export const SegmentedContext = createContext<SegmentedContextValue | null>(null);

export function useSegmentedContext() {
  return useContext(SegmentedContext);
}
