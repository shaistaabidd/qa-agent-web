import { ListIcon } from '@phosphor-icons/react/List';
import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import type { TopBarEndProps, TopBarMenuButtonProps, TopBarProps, TopBarStartProps } from './types';

export function TopBar({ children, className, ...props }: TopBarProps) {
  return (
    <header
      {...props}
      className={cn(
        'sticky top-0 z-(--z-sticky) flex h-[64px] items-center gap-[16px] border-b border-subtle bg-bg-surface px-[16px] sm:px-[24px]',
        className,
      )}
      data-slot="top-bar"
    >
      {children}
    </header>
  );
}

export function TopBarStart({ children, className, ...props }: TopBarStartProps) {
  return (
    <div
      {...props}
      className={cn('flex min-w-0 flex-1 items-center gap-[12px]', className)}
      data-slot="top-bar-start"
    >
      {children}
    </div>
  );
}

export function TopBarEnd({ children, className, ...props }: TopBarEndProps) {
  return (
    <div
      {...props}
      className={cn('flex items-center gap-[8px]', className)}
      data-slot="top-bar-end"
    >
      {children}
    </div>
  );
}

export function TopBarTitle({ children, className, ...props }: ComponentProps<'h1'>) {
  return (
    <h1
      {...props}
      className={cn('m-0 truncate text-label-lg text-fg-default', className)}
      data-slot="top-bar-title"
    >
      {children}
    </h1>
  );
}

export function TopBarMenuButton({
  'aria-label': ariaLabel = 'Open navigation',
  onClick,
}: TopBarMenuButtonProps) {
  return (
    <Button
      aria-label={ariaLabel}
      className="lg:hidden"
      onClick={onClick}
      size="icon-md"
      type="button"
      variant="ghost"
    >
      <ListIcon aria-hidden weight="regular" />
    </Button>
  );
}
