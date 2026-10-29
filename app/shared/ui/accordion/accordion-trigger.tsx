import { CaretDownIcon } from '@phosphor-icons/react/CaretDown';
import { CaretUpIcon } from '@phosphor-icons/react/CaretUp';

import { Typography } from '@/shared/ui/Typography';

import { useAccordionItemContext } from './accordion-context';
import { headerClass, iconClass } from './constants';
import type { AccordionTriggerProps } from './types';
import { getTriggerClassName } from './utils';

export function AccordionTrigger({
  children,
  className,
  onClick,
  ...props
}: AccordionTriggerProps) {
  const item = useAccordionItemContext();

  return (
    <h3 className={headerClass}>
      <button
        {...props}
        aria-controls={item.contentId}
        aria-expanded={item.open}
        className={getTriggerClassName(className)}
        data-open={item.open || undefined}
        data-slot="accordion-trigger"
        data-value={item.value}
        disabled={item.disabled}
        id={item.triggerId}
        onClick={(event) => {
          onClick?.(event);

          if (!event.defaultPrevented) {
            item.toggle();
          }
        }}
        type="button"
      >
        <Typography
          as="span"
          className="min-w-px flex-1 text-start text-fg-default"
          fontWeight="medium"
          variant="body3"
        >
          {children}
        </Typography>
        <span className={iconClass} data-slot="accordion-trigger-icon">
          {item.open ? (
            <CaretUpIcon aria-hidden weight="light" />
          ) : (
            <CaretDownIcon aria-hidden weight="light" />
          )}
        </span>
      </button>
    </h3>
  );
}
