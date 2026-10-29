import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';
import type { ComponentProps, KeyboardEvent } from 'react';

import { cn } from '@/shared/lib/utils';

const LINE = 40;

function onViewportKeyDown(event: KeyboardEvent<HTMLDivElement>) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.target !== event.currentTarget) {
    return;
  }

  const viewport = event.currentTarget;
  const page = viewport.clientHeight;
  let top = 0;
  let left = 0;

  switch (event.key) {
    case 'ArrowDown':
      top = LINE;
      break;
    case 'ArrowUp':
      top = -LINE;
      break;
    case 'ArrowRight':
      left = LINE;
      break;
    case 'ArrowLeft':
      left = -LINE;
      break;
    case 'PageDown':
      top = page;
      break;
    case 'PageUp':
      top = -page;
      break;
    case ' ':
      top = event.shiftKey ? -page : page;
      break;
    case 'Home':
      top = -viewport.scrollHeight;
      break;
    case 'End':
      top = viewport.scrollHeight;
      break;
    default:
      return;
  }

  const previousTop = viewport.scrollTop;
  const previousLeft = viewport.scrollLeft;
  viewport.scrollBy({ top, left });

  if (viewport.scrollTop !== previousTop || viewport.scrollLeft !== previousLeft) {
    event.preventDefault();
  }
}

function ScrollArea({
  className,
  children,
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      className={cn('relative', className)}
      data-slot="scroll-area"
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        className="size-full rounded-[inherit] outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:ring-brand-500/30 focus-visible:outline-1"
        data-slot="scroll-area-viewport"
        onKeyDown={onViewportKeyDown}
        tabIndex={0}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      className={cn(
        'flex touch-none p-px transition-colors select-none',
        'data-[orientation=horizontal]:h-[4px] data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-t-transparent',
        'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[4px] data-[orientation=vertical]:border-l data-[orientation=vertical]:border-l-transparent',
        className,
      )}
      data-orientation={orientation}
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        className="relative flex-1 rounded-full bg-[var(--border-color-medium)]"
        data-slot="scroll-area-thumb"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
