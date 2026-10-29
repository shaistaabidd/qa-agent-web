import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLatestRef } from '@/shared/lib/use-latest-ref';
import { useRovingKeyNav } from '@/shared/ui/tabs/use-roving-key-nav';

import { hiddenInputClass } from './constants';
import { SegmentedContext } from './segmented-context';
import type { SegmentedProps } from './types';
import { getRootClassName } from './utils';

export function Segmented({
  children,
  className,
  defaultValue,
  name,
  onValueChange,
  size = 'default',
  value,
  ...props
}: SegmentedProps) {
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
  const { rootRef } = useRovingKeyNav<HTMLDivElement>({
    onSelect: select,
    slot: 'segmented-item',
  });
  const context = useMemo(
    () => ({ onValueChange: select, size, value: currentValue }),
    [currentValue, select, size],
  );

  useEffect(() => {
    const root = rootRef.current;
    const selected = root?.querySelector<HTMLElement>('[data-selected]');

    if (!root || !selected) {
      return;
    }

    const rootBox = root.getBoundingClientRect();
    const itemBox = selected.getBoundingClientRect();
    const inset = Number.parseFloat(getComputedStyle(root).paddingLeft) || 0;

    if (itemBox.left < rootBox.left + inset) {
      root.scrollLeft += itemBox.left - rootBox.left - inset;
    } else if (itemBox.right > rootBox.right - inset) {
      root.scrollLeft += itemBox.right - rootBox.right + inset;
    }
  }, [currentValue, rootRef]);

  return (
    <SegmentedContext.Provider value={context}>
      <div
        {...props}
        className={getRootClassName(className)}
        data-slot="segmented"
        ref={rootRef}
        role="radiogroup"
      >
        {children}
      </div>
      {name ? (
        <input className={hiddenInputClass} name={name} readOnly value={currentValue ?? ''} />
      ) : null}
    </SegmentedContext.Provider>
  );
}
