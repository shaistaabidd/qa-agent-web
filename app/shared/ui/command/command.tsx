import { MagnifyingGlassIcon } from '@phosphor-icons/react/MagnifyingGlass';
import { Command as CommandPrimitive } from 'cmdk';
import type { ComponentProps } from 'react';

import { scrollbarClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';
import type { DialogProps } from '@/shared/ui/dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';

function Command({ className, ...props }: ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      className={cn(
        'flex size-full flex-col overflow-hidden rounded-[12px] bg-bg-elevated p-[4px] text-fg-default',
        className,
      )}
      data-slot="command"
      {...props}
    />
  );
}

function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  className,
  showCloseButton = false,
  ...props
}: DialogProps & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
}) {
  return (
    <Dialog {...props}>
      <DialogContent
        className={cn('overflow-hidden p-0', className)}
        showCloseButton={showCloseButton}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  wrapperClassName,
  placeholder,
  'aria-label': ariaLabel,
  ...props
}: ComponentProps<typeof CommandPrimitive.Input> & {
  wrapperClassName?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-[8px] border-b border-subtle px-[12px]',
        wrapperClassName,
      )}
      data-slot="command-input-wrapper"
    >
      <MagnifyingGlassIcon
        aria-hidden
        className="size-[16px] shrink-0 text-fg-secondary"
        weight="regular"
      />
      <CommandPrimitive.Input
        aria-label={ariaLabel ?? placeholder ?? 'Search'}
        className={cn(
          'flex h-[40px] w-full rounded-[4px] bg-transparent text-sm text-fg-default outline-none placeholder:text-fg-secondary disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        data-slot="command-input"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, ...props }: ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      className={cn(
        'max-h-[288px] scroll-py-[4px] overflow-x-hidden overflow-y-auto outline-none',
        scrollbarClass,
        className,
      )}
      data-slot="command-list"
      {...props}
    />
  );
}

function CommandEmpty({ className, ...props }: ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      className={cn('py-[24px] text-center text-sm text-fg-secondary', className)}
      data-slot="command-empty"
      {...props}
    />
  );
}

function CommandGroup({ className, ...props }: ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        'overflow-hidden p-[4px] text-fg-default',
        '**:[[cmdk-group-heading]]:px-[8px] **:[[cmdk-group-heading]]:py-[6px] **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-normal **:[[cmdk-group-heading]]:text-fg-secondary',
        className,
      )}
      data-slot="command-group"
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      className={cn('-mx-[4px] h-px bg-border-subtle', className)}
      data-slot="command-separator"
      {...props}
    />
  );
}

function CommandItem({
  className,
  children,
  ...props
}: ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(
        'group/command-item relative flex cursor-default items-center gap-[8px] rounded-[8px] px-[8px] py-[6px] text-sm outline-hidden select-none',
        'data-[selected=true]:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))] data-[selected=true]:text-fg-default',
        'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[16px]",
        className,
      )}
      data-slot="command-item"
      {...props}
    >
      {children}
    </CommandPrimitive.Item>
  );
}

function CommandShortcut({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'ml-auto text-[10px] tracking-wider text-fg-secondary group-data-[selected=true]/command-item:text-fg-default',
        className,
      )}
      data-slot="command-shortcut"
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
