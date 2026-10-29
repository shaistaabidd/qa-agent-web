import type { SortingState } from '@tanstack/react-table';
import type { LegacyColumnDef as ColumnDef } from '@tanstack/react-table/legacy';
import * as React from 'react';

import { getMessageString } from '@/shared/lib/getMessageString';
import { useLatestRef } from '@/shared/lib/use-latest-ref';
import { cn } from '@/shared/lib/utils';
import { Table } from '@/shared/ui/table';
import { toast } from '@/shared/ui/toast';

import { CrudDeleteDialog } from './crud-delete-dialog';
import { crudCellValue } from './crud-mobile-list';
import { CrudRowActions } from './crud-row-actions';
import type { CrudAction, CrudColumn, CrudListMutators, CrudSortState } from './types';

export type CrudTableProps<T extends object> = {
  columns: CrudColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  sortState?: CrudSortState;
  onSortChange?: (sort: CrudSortState) => void;
  isLoading?: boolean;
  emptyMessage?: React.ReactNode;
  actions?: CrudAction<T>[];
  listMutators?: CrudListMutators<T>;
  className?: string;
  onRowClick?: (row: T) => void;
  getRowLabel?: (row: T) => string;
  stickyFirstColumn?: boolean;
};

function noopListMutators<T>(): CrudListMutators<T> {
  return {
    goToFirstPage: () => {},
    insertItem: () => {},
    refetch: () => {},
    removeItem: () => {},
    replaceItem: () => {},
  };
}

export function CrudTable<T extends object>({
  columns,
  data,
  getRowId,
  sortState,
  onSortChange,
  isLoading,
  emptyMessage = 'No results.',
  actions,
  listMutators,
  className,
  onRowClick,
  getRowLabel,
  stickyFirstColumn = true,
}: CrudTableProps<T>) {
  const latestListMutators = useLatestRef(listMutators ?? noopListMutators<T>());
  // The list rebuilds its mutators every render. A stable wrapper keeps the column definitions
  // from changing, which would otherwise remount every cell (and drop focus) on each render.
  const resolvedListMutators = React.useMemo<CrudListMutators<T>>(
    () => ({
      goToFirstPage: () => latestListMutators.current.goToFirstPage(),
      insertItem: (item) => latestListMutators.current.insertItem(item),
      refetch: () => latestListMutators.current.refetch(),
      removeItem: (id) => latestListMutators.current.removeItem(id),
      replaceItem: (id, item) => latestListMutators.current.replaceItem(id, item),
    }),
    [latestListMutators],
  );
  const [pending, setPending] = React.useState<{ action: CrudAction<T>; row: T } | null>(null);
  const [confirming, setConfirming] = React.useState(false);

  const onConfirmRequest = React.useCallback((action: CrudAction<T>, row: T) => {
    setPending({ action, row });
  }, []);

  const sorting = React.useMemo<SortingState>(
    () => (sortState ? [{ id: sortState.field, desc: sortState.order === 'desc' }] : []),
    [sortState],
  );

  const columnDefs = React.useMemo<ColumnDef<T, unknown>[]>(() => {
    const defs: ColumnDef<T, unknown>[] = columns.map((column, index) => ({
      id: column.key,
      accessorFn: (row) => (row as Record<string, unknown>)[column.key],
      header: column.header,
      enableSorting: Boolean(column.sortable && onSortChange),
      ...(stickyFirstColumn && index === 0 ? { meta: { pin: 'left' as const } } : {}),
      cell: ({ row }) => (
        <div
          className={cn(
            // On a phone the locked column must leave room to scroll to the other columns.
            stickyFirstColumn && index === 0 && 'max-md:max-w-[45vw] max-md:overflow-hidden',
            column.className,
          )}
        >
          {crudCellValue(column, row.original, resolvedListMutators)}
        </div>
      ),
    }));

    if (actions?.length) {
      defs.push({
        id: '__actions',
        header: () => <span className="sr-only">Actions</span>,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <CrudRowActions
              actions={actions}
              getRowLabel={getRowLabel}
              listMutators={resolvedListMutators}
              onConfirmRequest={onConfirmRequest}
              row={row.original}
            />
          </div>
        ),
      });
    }

    return defs;
  }, [
    actions,
    columns,
    getRowLabel,
    onConfirmRequest,
    onSortChange,
    resolvedListMutators,
    stickyFirstColumn,
  ]);

  return (
    <div className={cn('relative w-full', className)} data-slot="crud-table">
      <Table
        card={false}
        columns={columnDefs}
        data={data}
        getRowId={(row) => getRowId(row)}
        loading={isLoading}
        locale={{ emptyText: emptyMessage }}
        onRow={
          onRowClick
            ? (record) => ({
                className: cn(
                  'cursor-pointer',
                  'hover:[&>td]:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
                  'active:[&>td]:bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))]',
                ),
                onClick: () => onRowClick(record),
              })
            : undefined
        }
        onSortingChange={
          onSortChange
            ? (next) => {
                const first = next[0];
                if (!first) {
                  onSortChange(null);
                  return;
                }
                onSortChange({ field: first.id, order: first.desc ? 'desc' : 'asc' });
              }
            : undefined
        }
        pagination={false}
        scroll={{ x: 'max-content' }}
        sorting={sorting}
      />
      <CrudDeleteDialog
        cancelLabel={pending?.action.confirm?.cancelLabel}
        confirmLabel={pending?.action.confirm?.confirmLabel}
        confirming={confirming}
        confirmingLabel={pending?.action.confirm?.confirmingLabel}
        description={pending?.action.confirm?.description}
        onConfirm={async () => {
          if (!pending) return;
          const { action, row } = pending;
          setConfirming(true);
          try {
            await action.onClick(row, resolvedListMutators);
            setPending(null);
          } catch (err) {
            toast.error(getMessageString(err, `${action.label} failed`));
          } finally {
            setConfirming(false);
          }
        }}
        onOpenChange={(open) => {
          if (!open && !confirming) {
            setPending(null);
            setConfirming(false);
          }
        }}
        open={pending != null}
        title={pending?.action.confirm?.title}
      />
    </div>
  );
}
