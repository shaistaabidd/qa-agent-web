import { cn } from '@/shared/lib/utils';
import { Dropdown, DropdownItem } from '@/shared/ui/dropdown';
import { PaginationControls } from '@/shared/ui/pagination';
import { Typography } from '@/shared/ui/Typography';

export type CrudPaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  total: number;
  itemLabel?: string;
  className?: string;
};

export function CrudPagination({
  page,
  pageCount,
  onPageChange,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  total,
  itemLabel = 'items',
  className,
}: CrudPaginationProps) {
  const showingFrom = total === 0 ? 0 : (page - 1) * (pageSize ?? 0) + 1;
  const showingTo = total === 0 ? 0 : Math.min(page * (pageSize ?? total), total);
  const showPageSize = pageSize != null && Boolean(pageSizeOptions?.length) && onPageSizeChange;

  if (total === 0 && !showPageSize) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-col items-stretch gap-[8px] border-t border-subtle px-[16px] py-[12px]',
        'lg:flex-row lg:flex-wrap lg:content-start lg:items-center lg:justify-between lg:gap-x-[24px]',
        className,
      )}
      data-slot="crud-pagination"
    >
      {showPageSize ? (
        <div className="flex shrink-0 items-center gap-[8px]">
          <Typography className="text-fg-secondary" variant="body3">
            Rows
          </Typography>
          <Dropdown
            aria-label="Rows per page"
            className="w-[84px] shrink-0"
            onValueChange={(value) => onPageSizeChange?.(Number(value))}
            size="sm"
            value={String(pageSize)}
          >
            {pageSizeOptions!.map((size) => (
              <DropdownItem key={size} value={String(size)}>
                {size}
              </DropdownItem>
            ))}
          </Dropdown>
        </div>
      ) : null}
      {total > 0 ? (
        <Typography className="min-w-0 text-fg-secondary lg:shrink-0" variant="body3">
          Showing{' '}
          <span className="text-fg-default">
            {showingFrom} – {showingTo}
          </span>{' '}
          of {total} {itemLabel}
        </Typography>
      ) : null}
      {total > 0 ? (
        <PaginationControls
          className="w-full shrink-0 lg:w-auto"
          onPageChange={onPageChange}
          page={page}
          pageCount={pageCount}
        />
      ) : null}
    </div>
  );
}
