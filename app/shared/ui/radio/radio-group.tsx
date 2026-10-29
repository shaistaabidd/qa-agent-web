import { createContext, useCallback, useContext, useId, useMemo, useState } from 'react';

import { useLatestRef } from '@/shared/lib/use-latest-ref';
import { cn } from '@/shared/lib/utils';

import { groupClass } from './constants';
import type { RadioGroupProps } from './types';

type RadioGroupContextValue = {
  disabled?: boolean;
  name: string;
  onValueChange: (value: string) => void;
  value?: string;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function useRadioGroup() {
  return useContext(RadioGroupContext);
}

export function RadioGroup({
  children,
  className,
  defaultValue,
  disabled,
  name,
  onValueChange,
  value,
  ...props
}: RadioGroupProps) {
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const currentValue = isControlled ? value : uncontrolledValue;

  const onValueChangeRef = useLatestRef(onValueChange);
  const select = useCallback(
    (next: string) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }

      onValueChangeRef.current?.(next);
    },
    [isControlled, onValueChangeRef],
  );
  const context = useMemo<RadioGroupContextValue>(
    () => ({ disabled, name: groupName, onValueChange: select, value: currentValue }),
    [currentValue, disabled, groupName, select],
  );

  return (
    <RadioGroupContext.Provider value={context}>
      <div
        {...props}
        aria-disabled={disabled || undefined}
        className={cn(groupClass, className)}
        data-slot="radio-group"
        role="radiogroup"
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}
