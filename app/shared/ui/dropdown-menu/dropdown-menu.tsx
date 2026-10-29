import { CaretRightIcon } from '@phosphor-icons/react/CaretRight';
import { CheckIcon } from '@phosphor-icons/react/Check';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';

import { scrollbarClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';

function DropdownMenu({
  modal = false,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" modal={modal} {...props} />;
}

function DropdownMenuPortal({ ...props }: ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({ ...props }: ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  className,
  align = 'start',
  sideOffset = 4,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align={align}
        className={cn(
          'z-(--z-dropdown) max-h-(--radix-dropdown-menu-content-available-height) min-w-[200px] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-[16px] border border-subtle bg-bg-elevated p-[4px] text-fg-default shadow-md duration-100',
          'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          'data-[state=closed]:overflow-hidden',
          scrollbarClass,
          className,
        )}
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({ ...props }: ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        'group/dropdown-menu-item relative flex h-[32px] cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] font-body text-body-base outline-hidden select-none',
        'text-fg-default focus:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
        'data-disabled:pointer-events-none data-disabled:text-fg-muted data-inset:pl-[28px]',
        'data-[variant=destructive]:text-fg-danger data-[variant=destructive]:[&_svg]:text-fg-danger',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-fg-secondary [&_svg:not([class*='size-'])]:size-[16px]",
        className,
      )}
      data-inset={inset || undefined}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        'relative flex h-[32px] cursor-pointer items-center gap-[8px] rounded-[8px] ps-[8px] pe-[32px] font-body text-body-base text-fg-default outline-hidden select-none',
        'focus:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
        'data-disabled:pointer-events-none data-disabled:text-fg-muted data-inset:pl-[28px]',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[16px]",
        className,
      )}
      data-inset={inset || undefined}
      data-slot="dropdown-menu-checkbox-item"
      {...props}
    >
      <span
        className="pointer-events-none absolute right-[8px] flex items-center justify-center text-fg-default"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon aria-hidden weight="bold" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.RadioItem
      className={cn(
        'relative flex h-[32px] cursor-pointer items-center gap-[8px] rounded-[8px] ps-[8px] pe-[32px] font-body text-body-base text-fg-default outline-hidden select-none',
        'focus:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
        'data-disabled:pointer-events-none data-disabled:text-fg-muted data-inset:pl-[28px]',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[16px]",
        className,
      )}
      data-inset={inset || undefined}
      data-slot="dropdown-menu-radio-item"
      {...props}
    >
      <span
        className="pointer-events-none absolute right-[8px] flex items-center justify-center text-fg-default"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon aria-hidden weight="bold" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        'px-[8px] pt-[8px] pb-[4px] text-overline tracking-[0.06em] text-fg-secondary uppercase data-inset:pl-[28px]',
        className,
      )}
      data-inset={inset || undefined}
      data-slot="dropdown-menu-label"
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn('my-[4px] h-px bg-border-subtle', className)}
      data-slot="dropdown-menu-separator"
      {...props}
    />
  );
}

function DropdownMenuShortcut({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'text-body-sm ml-auto text-fg-secondary group-focus/dropdown-menu-item:text-fg-default',
        className,
      )}
      data-slot="dropdown-menu-shortcut"
      {...props}
    />
  );
}

function DropdownMenuSub({ ...props }: ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        'flex h-[32px] cursor-pointer items-center gap-[8px] rounded-[8px] px-[8px] font-body text-body-base text-fg-default outline-hidden select-none',
        'focus:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))] data-open:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
        'data-inset:pl-[28px]',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-fg-secondary [&_svg:not([class*='size-'])]:size-[16px]",
        className,
      )}
      data-inset={inset || undefined}
      data-slot="dropdown-menu-sub-trigger"
      {...props}
    >
      {children}
      <CaretRightIcon aria-hidden className="ml-auto" weight="regular" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      className={cn(
        'z-(--z-dropdown) min-w-[200px] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-[16px] border border-subtle bg-bg-elevated p-[4px] text-fg-default shadow-md duration-100',
        'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      data-slot="dropdown-menu-sub-content"
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
