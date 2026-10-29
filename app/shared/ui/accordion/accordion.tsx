import { AccordionContext } from './accordion-context';
import type { AccordionProps } from './types';
import { useAccordion } from './use-accordion';
import { getRootClassName, handleAccordionKeyDown } from './utils';

export function Accordion({
  children,
  className,
  collapsible = false,
  defaultValue,
  disabled = false,
  onKeyDown,
  onValueChange,
  type = 'single',
  value,
  ...props
}: AccordionProps) {
  const context = useAccordion({
    collapsible,
    defaultValue,
    disabled,
    onValueChange: onValueChange as ((next: string | string[]) => void) | undefined,
    type,
    value,
  });

  return (
    <AccordionContext.Provider value={context}>
      <div
        role="presentation"
        {...props}
        className={getRootClassName(className)}
        data-disabled={disabled || undefined}
        data-slot="accordion"
        data-type={type}
        onKeyDown={(event) => {
          onKeyDown?.(event);

          if (!event.defaultPrevented) {
            handleAccordionKeyDown(event);
          }
        }}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}
