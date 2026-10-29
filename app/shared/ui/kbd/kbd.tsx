import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';

function Kbd({ className, ...props }: ComponentProps<'kbd'>) {
  return (
    <kbd
      className={cn(
        'pointer-events-none inline-flex h-[20px] w-fit min-w-[20px] items-center justify-center gap-[4px] rounded-[4px] bg-bg-muted px-[4px] font-sans text-xs font-normal text-fg-secondary select-none',
        'in-data-[slot=tooltip-content]:bg-fg-inverse/15 in-data-[slot=tooltip-content]:text-fg-inverse',
        "[&_svg:not([class*='size-'])]:size-3",
        className,
      )}
      data-slot="kbd"
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <kbd
      className={cn('inline-flex items-center gap-[4px]', className)}
      data-slot="kbd-group"
      {...props}
    />
  );
}

export { Kbd, KbdGroup };
