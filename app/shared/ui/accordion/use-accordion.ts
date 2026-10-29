import { useCallback, useMemo, useState } from 'react';

import type { AccordionContextValue } from './accordion-context';
import type { AccordionType } from './types';
import { toOpenValues } from './utils';

export function useAccordion({
  collapsible = false,
  defaultValue,
  disabled = false,
  onValueChange,
  type = 'single',
  value,
}: {
  collapsible?: boolean;
  defaultValue?: string | string[];
  disabled?: boolean;
  onValueChange?: (value: string | string[]) => void;
  type?: AccordionType;
  value?: string | string[];
}): AccordionContextValue {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() => toOpenValues(defaultValue));
  const openValues = isControlled ? toOpenValues(value) : uncontrolledValue;

  const setOpenValues = useCallback(
    (next: string[]) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }

      if (type === 'multiple') {
        onValueChange?.(next);
        return;
      }

      onValueChange?.(next[0] ?? '');
    },
    [isControlled, onValueChange, type],
  );

  const toggle = useCallback(
    (itemValue: string) => {
      if (disabled) {
        return;
      }

      const isOpen = openValues.includes(itemValue);

      if (type === 'multiple') {
        setOpenValues(
          isOpen
            ? openValues.filter((openValue) => openValue !== itemValue)
            : [...openValues, itemValue],
        );
        return;
      }

      if (isOpen) {
        if (collapsible) {
          setOpenValues([]);
        }

        return;
      }

      setOpenValues([itemValue]);
    },
    [collapsible, disabled, openValues, setOpenValues, type],
  );

  return useMemo(
    () => ({
      disabled,
      openValues,
      toggle,
      type,
    }),
    [disabled, openValues, toggle, type],
  );
}
