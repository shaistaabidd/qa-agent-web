import { cn } from '@/shared/lib/utils';

import { useAccordionItemContext } from './accordion-context';
import { panelInnerClass } from './constants';
import type { AccordionContentProps } from './types';
import { getContentClassName, getPanelClassName } from './utils';

export function AccordionContent({ children, className, ...props }: AccordionContentProps) {
  const item = useAccordionItemContext();

  return (
    <div
      {...props}
      className={cn(getPanelClassName(item.open), 'w-full')}
      data-open={item.open || undefined}
      data-slot="accordion-content"
      id={item.contentId}
      inert={item.open ? undefined : true}
      aria-labelledby={item.triggerId}
      role="region"
    >
      <div className={cn(panelInnerClass, 'w-full')}>
        <div className={getContentClassName(className)}>{children}</div>
      </div>
    </div>
  );
}
