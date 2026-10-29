import { createContext, useContext } from 'react';

import type { StepperDirection, StepperItemDirection } from './types';

export type StepperContextValue = {
  direction: StepperDirection;
  itemDirection: StepperItemDirection;
};

export const StepperContext = createContext<StepperContextValue | null>(null);

export function useStepperContext() {
  return useContext(StepperContext);
}
