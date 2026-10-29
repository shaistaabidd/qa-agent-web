import { CaretRightIcon } from '@phosphor-icons/react/CaretRight';
import { DotsThreeIcon } from '@phosphor-icons/react/DotsThree';
import { Slot } from 'radix-ui';
import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';

function Breadcrumb({ className, ...props }: ComponentProps<'nav'>) {
  return (
    <nav aria-label="breadcrumb" className={cn(className)} data-slot="breadcrumb" {...props} />
  );
}

function BreadcrumbList({ className, ...props }: ComponentProps<'ol'>) {
  return (
    <ol
      className={cn(
        'flex flex-wrap items-center gap-[4px] text-body-base text-fg-secondary wrap-break-word',
        'max-[639px]:[&>li:not(:nth-last-child(-n+3))]:hidden',
        className,
      )}
      data-slot="breadcrumb-list"
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: ComponentProps<'li'>) {
  return (
    <li
      className={cn('inline-flex min-w-0 items-center gap-[4px]', className)}
      data-slot="breadcrumb-item"
      {...props}
    />
  );
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: ComponentProps<'a'> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : 'a';

  return (
    <Comp
      className={cn(
        'max-w-[200px] overflow-hidden rounded-[8px] px-[4px] text-ellipsis whitespace-nowrap text-fg-secondary no-underline transition-colors hover:text-fg-default hover:underline focus-visible:shadow-focus focus-visible:outline-none',
        className,
      )}
      data-slot="breadcrumb-link"
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      aria-current="page"
      aria-disabled="true"
      className={cn('px-[4px] font-medium text-fg-default', className)}
      data-slot="breadcrumb-page"
      role="link"
      {...props}
    />
  );
}

function BreadcrumbSeparator({ children, className, ...props }: ComponentProps<'li'>) {
  return (
    <li
      aria-hidden="true"
      className={cn('inline-flex text-fg-secondary [&>svg]:size-4', className)}
      data-slot="breadcrumb-separator"
      role="presentation"
      {...props}
    >
      {children ?? <CaretRightIcon aria-hidden weight="regular" />}
    </li>
  );
}

function BreadcrumbEllipsis({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-5 items-center justify-center text-fg-secondary [&>svg]:size-4',
        className,
      )}
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      {...props}
    >
      <DotsThreeIcon aria-hidden weight="bold" />
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
