import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import type { KeyboardEvent, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

import { CrudRowActions } from './crud-row-actions';
import type { CrudAction, CrudColumn, CrudListMutators } from './types';

export function crudCellValue<T>(column: CrudColumn<T>, row: T, list: CrudListMutators<T>) {
  if (column.render) return column.render(row, list);
  const value = (row as Record<string, unknown>)[column.key];
  if (value == null) return '';
  return String(value);
}

function MobileCardShell({
  className,
  onClick,
  children,
}: {
  className: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  if (!onClick) {
    return (
      <div className={className} data-slot="crud-mobile-card">
        {children}
      </div>
    );
  }

  const activate = onClick;

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activate();
    }
  }

  return (
    <div
      className={className}
      data-slot="crud-mobile-card"
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
}

function MobileField<T>({
  column,
  list,
  row,
}: {
  column: CrudColumn<T>;
  list: CrudListMutators<T>;
  row: T;
}) {
  return (
    <div className="min-w-0 space-y-[2px]">
      <div className="text-xs font-medium tracking-[0.075em] text-fg-secondary uppercase">
        {column.mobileLabel ?? column.header}
      </div>
      <div
        className={cn('text-sm break-words whitespace-normal text-fg-default', column.className)}
      >
        {crudCellValue(column, row, list)}
      </div>
    </div>
  );
}

export function CrudMobileList<T>({
  columns,
  data,
  getRowId,
  actions,
  emptyMessage,
  isLoading,
  onConfirmRequest,
  listMutators,
  onRowClick,
  getRowLabel,
}: {
  columns: CrudColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  actions?: CrudAction<T>[];
  emptyMessage: ReactNode;
  isLoading?: boolean;
  onConfirmRequest: (action: CrudAction<T>, row: T) => void;
  listMutators: CrudListMutators<T>;
  onRowClick?: (row: T) => void;
  getRowLabel?: (row: T) => string;
}) {
  const visible = columns.filter((column) => !column.hideOnMobile);
  const pairedKeys = new Set(visible.map((column) => column.pairWith).filter(Boolean) as string[]);
  const hasActions = Boolean(actions?.length);

  if (data.length === 0) {
    if (isLoading) {
      return <p className="px-[16px] py-[32px] text-center text-sm text-fg-secondary">Loading…</p>;
    }

    return <div className="px-[16px] py-[32px]">{emptyMessage}</div>;
  }

  return (
    <div className="relative">
      <div aria-busy={isLoading || undefined} className="flex flex-col gap-[12px] p-[12px]">
        {data.map((row) => {
          const rendered = new Set<string>();
          return (
            <MobileCardShell
              className={cn(
                'relative space-y-[12px] rounded-[12px] border border-subtle bg-bg-surface p-[16px]',
                hasActions && 'pt-[48px]',
                onRowClick && 'cursor-pointer',
              )}
              key={getRowId(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {hasActions ? (
                <div className="absolute top-[12px] right-[12px]">
                  <CrudRowActions
                    actions={actions!}
                    getRowLabel={getRowLabel}
                    listMutators={listMutators}
                    onConfirmRequest={onConfirmRequest}
                    row={row}
                  />
                </div>
              ) : null}
              {visible.map((column) => {
                if (rendered.has(column.key)) return null;
                if (pairedKeys.has(column.key) && !column.pairWith) return null;

                if (column.pairWith) {
                  const partner = visible.find((item) => item.key === column.pairWith);
                  rendered.add(column.key);
                  if (partner) rendered.add(partner.key);
                  return (
                    <div className="grid grid-cols-2 gap-[12px]" key={column.key}>
                      <MobileField column={column} list={listMutators} row={row} />
                      {partner ? (
                        <MobileField column={partner} list={listMutators} row={row} />
                      ) : null}
                    </div>
                  );
                }

                rendered.add(column.key);
                return (
                  <MobileField column={column} key={column.key} list={listMutators} row={row} />
                );
              })}
            </MobileCardShell>
          );
        })}
      </div>
      {isLoading ? (
        <div className="absolute inset-0 z-(--z-sticky) flex items-center justify-center bg-bg-surface/70">
          <CircleNotchIcon
            aria-label="Loading"
            className="size-6 animate-spin text-fg-secondary"
            weight="bold"
          />
        </div>
      ) : null}
    </div>
  );
}
