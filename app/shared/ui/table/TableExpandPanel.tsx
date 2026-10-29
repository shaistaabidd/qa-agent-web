import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

/** Same height animation as AccordionContent (`grid-rows` 0fr → 1fr). */
const panelClass = 'grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out';

type TableExpandPanelProps = {
  children: ReactNode;
  className?: string;
  open: boolean;
};

export function TableExpandPanel({ children, className, open }: TableExpandPanelProps) {
  return (
    <div
      aria-hidden={!open}
      className={cn(
        panelClass,
        open ? 'grid-rows-[1fr] overflow-visible' : 'grid-rows-[0fr]',
        className,
      )}
      data-open={open || undefined}
      data-slot="table-expand-panel"
      inert={open ? undefined : true}
    >
      <div className="min-h-0">{children}</div>
    </div>
  );
}
