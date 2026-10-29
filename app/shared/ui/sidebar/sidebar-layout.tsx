import { Slot } from 'radix-ui';
import type { ComponentProps } from 'react';

import { scrollbarClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';
import { Divider } from '@/shared/ui/divider';

export function SidebarHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-4',
        className,
      )}
      data-sidebar="header"
      data-slot="sidebar-header"
      {...props}
    />
  );
}

export function SidebarFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col px-4 py-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-4',
        className,
      )}
      data-sidebar="footer"
      data-slot="sidebar-footer"
      {...props}
    />
  );
}

export function SidebarSeparator({ className, ...props }: ComponentProps<'div'>) {
  return (
    <Divider
      className={cn('!py-0', className)}
      data-sidebar="separator"
      data-slot="sidebar-separator"
      {...props}
    />
  );
}

export function SidebarContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain',
        scrollbarClass,
        className,
      )}
      data-sidebar="content"
      data-slot="sidebar-content"
      {...props}
    />
  );
}

export function SidebarGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'relative flex w-full min-w-0 flex-col px-4 pt-2 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-4',
        className,
      )}
      data-sidebar="group"
      data-slot="sidebar-group"
      {...props}
    />
  );
}

export function SidebarGroupLabel({
  asChild = false,
  className,
  ...props
}: ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'div';

  return (
    <Comp
      className={cn(
        'flex shrink-0 items-center px-[12px] pt-[8px] pb-[4px] text-overline tracking-[0.06em] text-fg-secondary uppercase outline-hidden transition-[margin,opacity] duration-200 ease-linear',
        'group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:h-0 group-data-[collapsible=icon]:min-h-0 group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:p-0',
        className,
      )}
      data-sidebar="group-label"
      data-slot="sidebar-group-label"
      {...props}
    />
  );
}

export function SidebarGroupContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('w-full text-sm', className)}
      data-sidebar="group-content"
      data-slot="sidebar-group-content"
      {...props}
    />
  );
}
