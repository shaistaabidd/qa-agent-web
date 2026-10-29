import { CaretRightIcon } from '@phosphor-icons/react/CaretRight';
import { CheckIcon } from '@phosphor-icons/react/Check';
import { ContextMenu as ContextMenuPrimitive } from 'radix-ui';
import type { ComponentProps, KeyboardEvent } from 'react';

import { scrollbarClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';

function ContextMenu({ ...props }: ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

// Radix opens on a contextmenu event only. The trigger is a span, so it is not
// focusable, and Shift+F10 does not fire that event on macOS.
function openContextMenuFromKeyboard(event: KeyboardEvent<HTMLElement>) {
  if (event.defaultPrevented || event.repeat) return;
  if (event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10')) return;

  event.preventDefault();
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
    }),
  );
}

function ContextMenuTrigger({
  className,
  disabled,
  onKeyDown,
  tabIndex,
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger
      disabled={disabled}
      tabIndex={tabIndex ?? (disabled ? undefined : 0)}
      {...props}
      className={cn('rounded-[8px] outline-none select-none focus-visible:shadow-focus', className)}
      data-slot="context-menu-trigger"
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (disabled) return;
        openContextMenuFromKeyboard(event);
      }}
    />
  );
}

function ContextMenuGroup({ ...props }: ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />;
}

function ContextMenuPortal({ ...props }: ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />;
}

function ContextMenuSub({ ...props }: ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
}

function ContextMenuRadioGroup({
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />;
}

function ContextMenuContent({
  className,
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        className={cn(
          'z-(--z-dropdown) max-h-(--radix-context-menu-content-available-height) min-w-[200px] origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-[16px] border border-subtle bg-bg-elevated p-[4px] text-fg-default shadow-md duration-100',
          'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          scrollbarClass,
          className,
        )}
        data-slot="context-menu-content"
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <ContextMenuPrimitive.Item
      className={cn(
        'group/context-menu-item relative flex h-[32px] cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] font-body text-body-base outline-hidden select-none',
        'text-fg-default focus:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
        'data-disabled:pointer-events-none data-disabled:text-fg-muted data-inset:pl-[28px]',
        'data-[variant=destructive]:text-fg-danger data-[variant=destructive]:[&_svg]:text-fg-danger',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-fg-secondary [&_svg:not([class*='size-'])]:size-[16px]",
        className,
      )}
      data-inset={inset || undefined}
      data-slot="context-menu-item"
      data-variant={variant}
      {...props}
    />
  );
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      className={cn(
        'flex h-[32px] cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] font-body text-body-base text-fg-default outline-hidden select-none',
        'focus:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))] data-open:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
        'data-inset:pl-[28px]',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-fg-secondary [&_svg:not([class*='size-'])]:size-[16px]",
        className,
      )}
      data-inset={inset || undefined}
      data-slot="context-menu-sub-trigger"
      {...props}
    >
      {children}
      <CaretRightIcon aria-hidden className="ml-auto" weight="regular" />
    </ContextMenuPrimitive.SubTrigger>
  );
}

function ContextMenuSubContent({
  className,
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.SubContent
      className={cn(
        'z-(--z-dropdown) min-w-[200px] origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-[16px] border border-subtle bg-bg-elevated p-[4px] text-fg-default shadow-md duration-100',
        'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      data-slot="context-menu-sub-content"
      {...props}
    />
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.CheckboxItem> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        'relative flex h-[32px] cursor-pointer items-center gap-[8px] rounded-[8px] ps-[8px] pe-[32px] font-body text-body-base text-fg-default outline-hidden select-none',
        'focus:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
        'data-disabled:pointer-events-none data-disabled:text-fg-muted data-inset:pl-[28px]',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[16px]",
        className,
      )}
      data-inset={inset || undefined}
      data-slot="context-menu-checkbox-item"
      {...props}
    >
      <span className="pointer-events-none absolute right-[8px] flex items-center justify-center text-fg-default">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon aria-hidden weight="bold" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

function ContextMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.RadioItem> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.RadioItem
      className={cn(
        'relative flex h-[32px] cursor-pointer items-center gap-[8px] rounded-[8px] ps-[8px] pe-[32px] font-body text-body-base text-fg-default outline-hidden select-none',
        'focus:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
        'data-disabled:pointer-events-none data-disabled:text-fg-muted data-inset:pl-[28px]',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[16px]",
        className,
      )}
      data-inset={inset || undefined}
      data-slot="context-menu-radio-item"
      {...props}
    >
      <span className="pointer-events-none absolute right-[8px] flex items-center justify-center text-fg-default">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon aria-hidden weight="bold" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.Label
      className={cn(
        'px-[8px] pt-[8px] pb-[4px] text-overline tracking-[0.06em] text-fg-secondary uppercase data-inset:pl-[28px]',
        className,
      )}
      data-inset={inset || undefined}
      data-slot="context-menu-label"
      {...props}
    />
  );
}

function ContextMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      className={cn('my-[4px] h-px bg-border-subtle', className)}
      data-slot="context-menu-separator"
      {...props}
    />
  );
}

function ContextMenuShortcut({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'text-body-sm ml-auto text-fg-secondary group-focus/context-menu-item:text-fg-default',
        className,
      )}
      data-slot="context-menu-shortcut"
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};
