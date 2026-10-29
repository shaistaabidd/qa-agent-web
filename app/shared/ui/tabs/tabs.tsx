import { useCallback, useMemo, useState } from 'react';

import { useLatestRef } from '@/shared/lib/use-latest-ref';

import { hiddenInputClass } from './constants';
import { TabsContext } from './tabs-context';
import type { TabsProps } from './types';
import { useRovingKeyNav } from './use-roving-key-nav';
import { getRootClassName } from './utils';

export function Tabs({
  children,
  className,
  defaultValue,
  fullWidth = false,
  id,
  name,
  onValueChange,
  size = 'default',
  value,
  ...props
}: TabsProps) {
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
    slot: 'tab-item',
  });
  const context = useMemo(
    () => ({ fullWidth, id, onValueChange: select, size, value: currentValue }),
    [currentValue, fullWidth, id, select, size],
  );

  return (
    <TabsContext.Provider value={context}>
      <div
        {...props}
        className={getRootClassName(fullWidth, className)}
        data-full-width={fullWidth || undefined}
        data-slot="tabs"
        id={id}
        ref={rootRef}
        role="tablist"
      >
        {children}
      </div>
      {name ? (
        <input className={hiddenInputClass} name={name} readOnly value={currentValue ?? ''} />
      ) : null}
    </TabsContext.Provider>
  );
}
