import * as ResizablePrimitive from 'react-resizable-panels';

import { cn } from '@/shared/lib/utils';

function ResizablePanelGroup({ className, ...props }: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      className={cn('flex h-full w-full aria-[orientation=vertical]:flex-col', className)}
      data-slot="resizable-panel-group"
      {...props}
    />
  );
}

function ResizablePanel({ minSize = '20%', ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" minSize={minSize} {...props} />;
}

function ResizableHandle({
  withHandle,
  className,
  'aria-label': ariaLabel = 'Resize panels',
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean;
}) {
  return (
    <ResizablePrimitive.Separator
      aria-label={ariaLabel}
      className={cn(
        'relative flex w-px items-center justify-center bg-[var(--border-color-low)] outline-hidden',
        'after:absolute after:inset-y-0 after:left-1/2 after:w-[4px] after:-translate-x-1/2',
        'focus-visible:ring-1 focus-visible:ring-brand-500',
        'aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full',
        'aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-[4px] aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2',
        '[&[aria-orientation=horizontal]>div]:rotate-90',
        className,
      )}
      data-slot="resizable-handle"
      {...props}
    >
      {withHandle ? (
        <div
          aria-hidden
          className="z-10 flex h-[24px] w-[4px] shrink-0 rounded-[8px] bg-[var(--border-color-medium)]"
        />
      ) : null}
    </ResizablePrimitive.Separator>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
