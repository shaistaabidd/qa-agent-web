import { useId, useMemo } from 'react';

import { AccordionItemContext, useAccordionContext } from './accordion-context';
import type { AccordionItemProps } from './types';
import { getItemClassName } from './utils';

export function AccordionItem({
  children,
  className,
  disabled = false,
  value,
  ...props
}: AccordionItemProps) {
  const accordion = useAccordionContext();
  const generatedId = useId();
  const open = accordion.openValues.includes(value);
  const itemDisabled = accordion.disabled || disabled;

  const context = useMemo(
    () => ({
      contentId: `${generatedId}-content`,
      disabled: itemDisabled,
      open,
      toggle() {
        if (itemDisabled) {
          return;
        }

        accordion.toggle(value);
      },
      triggerId: `${generatedId}-trigger`,
      value,
    }),
    [accordion, generatedId, itemDisabled, open, value],
  );

  return (
    <AccordionItemContext.Provider value={context}>
      <div
        {...props}
        className={getItemClassName(className)}
        data-disabled={itemDisabled || undefined}
        data-open={open || undefined}
        data-slot="accordion-item"
        data-value={value}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}
