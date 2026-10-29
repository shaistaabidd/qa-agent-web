import { XIcon } from '@phosphor-icons/react/X';
import { Dialog as SheetPrimitive } from 'radix-ui';
import { type ComponentProps, useCallback, useRef } from 'react';

import { deferEscape, pushOverlay } from '@/shared/lib/overlay-stack';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

function Sheet({ ...props }: ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }: ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-(--z-modal) bg-bg-scrim duration-200',
        'data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
        className,
      )}
      data-slot="sheet-overlay"
      {...props}
    />
  );
}

function SheetContent({
  children,
  className,
  showCloseButton = true,
  onEscapeKeyDown,
  ref,
  side = 'right',
  ...props
}: ComponentProps<typeof SheetPrimitive.Content> & {
  showCloseButton?: boolean;
  side?: 'bottom' | 'left' | 'right' | 'top';
}) {
  const overlayRef = useRef<ReturnType<typeof pushOverlay> | null>(null);

  // The content node exists only while the sheet is open. Registering in the
  // shared stack lets a Dialog or Drawer opened above it own Escape.
  const registerRef = useCallback(
    (node: HTMLDivElement | null) => {
      overlayRef.current?.remove();
      overlayRef.current = node ? pushOverlay() : null;

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        className={cn(
          'fixed z-(--z-modal) flex flex-col border-subtle bg-bg-elevated text-fg-default shadow-md transition duration-200 ease-in-out',
          'data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
          'data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:rounded-t-[24px] data-[side=bottom]:border-t data-[side=bottom]:data-open:slide-in-from-bottom-10 data-[side=bottom]:data-closed:slide-out-to-bottom-10',
          'data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-full data-[side=left]:max-w-[420px] data-[side=left]:rounded-r-[24px] data-[side=left]:border-r data-[side=left]:data-open:slide-in-from-left-10 data-[side=left]:data-closed:slide-out-to-left-10',
          'data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-full data-[side=right]:max-w-[420px] data-[side=right]:rounded-l-[24px] data-[side=right]:border-l data-[side=right]:data-open:slide-in-from-right-10 data-[side=right]:data-closed:slide-out-to-right-10',
          'data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:rounded-b-[24px] data-[side=top]:border-b data-[side=top]:data-open:slide-in-from-top-10 data-[side=top]:data-closed:slide-out-to-top-10',
          className,
        )}
        data-side={side}
        data-slot="sheet-content"
        ref={registerRef}
        onEscapeKeyDown={(event) => {
          onEscapeKeyDown?.(event);

          if (!event.defaultPrevented && overlayRef.current && !overlayRef.current.isTop()) {
            deferEscape(event);
            event.preventDefault();
          }
        }}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <SheetPrimitive.Close asChild data-slot="sheet-close">
            <Button className="absolute top-[16px] right-[16px]" size="icon-sm" variant="ghost">
              <XIcon aria-hidden weight="light" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetPrimitive.Close>
        ) : null}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-[4px] p-[24px] pb-0', className)}
      data-slot="sheet-header"
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'mt-auto flex flex-col gap-[8px] border-t border-subtle p-[16px] px-[24px]',
        className,
      )}
      data-slot="sheet-footer"
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      className={cn('text-heading-sm text-fg-default font-semibold', className)}
      data-slot="sheet-title"
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      className={cn('text-body-base mt-[4px] text-fg-secondary', className)}
      data-slot="sheet-description"
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
