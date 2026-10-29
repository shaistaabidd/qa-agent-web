import { CaretLeftIcon } from '@phosphor-icons/react/CaretLeft';
import { CaretRightIcon } from '@phosphor-icons/react/CaretRight';
import type { ButtonHTMLAttributes, ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Typography } from '@/shared/ui/Typography';

import type { PaginationProps } from './types';
import { getVisiblePages } from './utils';

const pageButtonClass =
  'inline-grid min-w-[32px] h-[32px] shrink-0 cursor-pointer place-items-center rounded-full px-[8px] font-body text-label-base text-fg-default outline-none transition-colors select-none hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))] active:bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))] focus-visible:shadow-[inset_0_0_0_1px_var(--border-color-focus),0_0_0_4px_var(--color-state-focus)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-fg-muted';

const pageButtonActiveClass = 'bg-bg-primary-subtle text-fg-primary';

export function PaginationNav({ className, ...props }: ComponentProps<'nav'>) {
  return (
    <nav
      className={cn('flex items-center', className)}
      data-slot="pagination"
      {...props}
      aria-label={props['aria-label'] ?? 'Pagination'}
    />
  );
}

export function PaginationContent({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      className={cn('flex flex-row items-center gap-[4px]', className)}
      data-slot="pagination-content"
      {...props}
    />
  );
}

export function PaginationItem({ className, ...props }: ComponentProps<'li'>) {
  return <li className={cn('list-none', className)} data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
};

export function PaginationLink({
  className,
  isActive = false,
  type = 'button',
  ...props
}: PaginationLinkProps) {
  return (
    <button
      aria-current={isActive ? 'page' : undefined}
      className={cn(pageButtonClass, isActive && pageButtonActiveClass, className)}
      data-slot="pagination-link"
      type={type}
      {...props}
    />
  );
}

type PaginationStepProps = {
  disabled: boolean;
  onClick: () => void;
};

export function PaginationPrevious({ disabled, onClick }: PaginationStepProps) {
  return (
    <Button
      disabled={disabled}
      leftIcon={<CaretLeftIcon aria-hidden weight="regular" />}
      onClick={onClick}
      size="sm"
      variant="outline"
    >
      <span className="sr-only min-[380px]:not-sr-only">Previous</span>
    </Button>
  );
}

export function PaginationNext({ disabled, onClick }: PaginationStepProps) {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      rightIcon={<CaretRightIcon aria-hidden weight="regular" />}
      size="sm"
      variant="outline"
    >
      <span className="sr-only min-[380px]:not-sr-only">Next</span>
    </Button>
  );
}

export function PaginationEllipsis({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-grid h-[32px] min-w-[32px] place-items-center font-body text-label-base text-fg-secondary',
        className,
      )}
      data-slot="pagination-ellipsis"
      {...props}
      aria-hidden="true"
    >
      …
    </span>
  );
}

type PaginationControlsProps = {
  className?: string;
  label?: string;
  onPageChange: (page: number) => void;
  page: number;
  pageCount: number;
};

export function PaginationControls({
  className,
  label,
  onPageChange,
  page,
  pageCount,
}: PaginationControlsProps) {
  if (pageCount <= 1) {
    return null;
  }

  const pages = getVisiblePages(page, pageCount);

  return (
    <PaginationNav aria-label={label} className={cn('gap-[8px]', className)}>
      <PaginationPrevious disabled={page <= 1} onClick={() => onPageChange(page - 1)} />
      <Typography
        aria-current="page"
        className="min-w-0 flex-1 text-center whitespace-nowrap text-fg-secondary sm:hidden"
        variant="body3"
      >
        Page <span className="text-fg-default">{page}</span> of {pageCount}
      </Typography>
      <PaginationContent className="hidden sm:flex">
        {pages.map((item, index) =>
          item === '...' ? (
            <PaginationItem key={`ellipsis-${index}`} aria-hidden="true">
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                aria-label={`Page ${item}`}
                isActive={item === page}
                onClick={() => onPageChange(item)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
      </PaginationContent>
      <PaginationNext disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} />
    </PaginationNav>
  );
}

export function Pagination({
  className,
  itemLabel = 'items',
  label,
  onPageChange,
  page,
  pageCount,
  showingFrom,
  showingTo,
  total,
}: PaginationProps) {
  if (total === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-[12px] bg-bg-surface px-[16px] py-[12px]',
        className,
      )}
      data-slot="pagination-footer"
    >
      <Typography className="text-fg-secondary" variant="body3">
        Showing{' '}
        <span className="text-fg-default">
          {showingFrom} – {showingTo}
        </span>{' '}
        of {total} {itemLabel}
      </Typography>
      <PaginationControls
        label={label}
        onPageChange={onPageChange}
        page={page}
        pageCount={pageCount}
      />
    </div>
  );
}
