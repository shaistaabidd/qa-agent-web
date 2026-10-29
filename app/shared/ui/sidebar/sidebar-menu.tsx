import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { type ComponentProps, useContext } from 'react';

import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Tooltip } from '@/shared/ui/tooltip';

import { SidebarContext } from './sidebar-context';

export function SidebarMenu({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      className={cn('flex w-full min-w-0 flex-col', className)}
      data-sidebar="menu"
      data-slot="sidebar-menu"
      {...props}
    />
  );
}

export function SidebarMenuItem({ className, ...props }: ComponentProps<'li'>) {
  return (
    <li
      className={cn('group/menu-item relative', className)}
      data-sidebar="menu-item"
      data-slot="sidebar-menu-item"
      {...props}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  [
    'peer/menu-button relative flex h-[40px] w-full cursor-pointer items-center gap-[12px] overflow-hidden rounded-full',
    'border-0 bg-transparent px-[12px] text-left text-label-base text-fg-default outline-hidden',
    'transition-colors',
    'hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
    'active:bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))]',
    'focus-visible:shadow-[inset_0_0_0_1px_var(--border-color-focus),0_0_0_4px_var(--color-state-focus)]',
    'disabled:pointer-events-none disabled:opacity-50',
    'group-data-[collapsible=icon]:size-[40px]! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0! group-data-[collapsible=icon]:px-0!',
    'data-active:bg-bg-primary-subtle data-active:text-fg-primary',
    'data-active:hover:text-fg-default data-active:active:text-fg-default',
    '[&>span:last-child]:truncate group-data-[collapsible=icon]:[&>span:not([data-slot=sidebar-icon])]:sr-only',
    '[&_svg]:size-[20px] [&_svg]:shrink-0 [&_svg]:text-fg-secondary',
    'data-active:[&_svg]:text-fg-primary hover:[&_svg]:text-fg-default active:[&_svg]:text-fg-default',
  ].join(' '),
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-[40px] text-label-base',
        lg: 'h-[48px] text-label-lg group-data-[collapsible=icon]:p-0!',
        sm: 'h-[32px] pl-[44px] text-label-sm text-fg-secondary hover:text-fg-default',
      },
      variant: {
        default: '',
        outline: 'shadow-[inset_0_0_0_1px_var(--border-color-subtle)]',
      },
    },
  },
);

export function SidebarMenuButton({
  asChild = false,
  className,
  isActive = false,
  size = 'default',
  tooltip,
  variant = 'default',
  ...props
}: ComponentProps<'button'> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot.Root : 'button';
  const sidebar = useContext(SidebarContext);
  const collapsedTooltip =
    tooltip && sidebar?.state === 'collapsed' && !sidebar.isMobile ? tooltip : undefined;
  const button = (
    <Comp
      className={cn(sidebarMenuButtonVariants({ size, variant }), className)}
      data-active={isActive || undefined}
      data-sidebar="menu-button"
      data-size={size}
      data-slot="sidebar-menu-button"
      {...props}
      {...(collapsedTooltip ? { 'aria-label': collapsedTooltip } : {})}
    />
  );

  if (!collapsedTooltip) {
    return button;
  }

  return (
    <Tooltip content={collapsedTooltip} delayDuration={0} side="right">
      {button}
    </Tooltip>
  );
}

export function SidebarMenuBadge({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'pointer-events-none ml-auto group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:top-[-2px] group-data-[collapsible=icon]:right-[-2px] group-data-[collapsible=icon]:ml-0',
        className,
      )}
      data-sidebar="menu-badge"
      data-slot="sidebar-menu-badge"
      {...props}
    >
      <Badge variant="primary">{children}</Badge>
    </div>
  );
}
