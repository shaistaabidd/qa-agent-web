import { createContext, useContext } from 'react';

import type { PhoneInputSize } from './types';

export type PhoneFieldContextValue = {
  size: PhoneInputSize;
};

export const PhoneFieldContext = createContext<PhoneFieldContextValue>({
  size: 'lg',
});

export function usePhoneField() {
  return useContext(PhoneFieldContext);
}
