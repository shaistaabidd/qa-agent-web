import { DotsThreeIcon } from '@phosphor-icons/react/DotsThree';
import * as React from 'react';

import { getMessageString } from '@/shared/lib/getMessageString';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { toast } from '@/shared/ui/toast';

import type { CrudAction, CrudListMutators } from './types';

function actionsLabel<T>(row: T, getRowLabel?: (row: T) => string) {
  const fromCaller = getRowLabel?.(row)?.trim();
  if (fromCaller) return `Actions for ${fromCaller}`;

  const record = row as Record<string, unknown>;
  for (const key of ['name', 'title']) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return `Actions for ${value.trim()}`;
  }

  return 'Row actions';
}

export function CrudRowActions<T>({
  actions,
  row,
  onConfirmRequest,
  listMutators,
  getRowLabel,
}: {
  actions: CrudAction<T>[];
  row: T;
  onConfirmRequest: (action: CrudAction<T>, row: T) => void;
  listMutators: CrudListMutators<T>;
  getRowLabel?: (row: T) => string;
}) {
  const visibleActions = actions.filter((action) => !action.isVisible || action.isVisible(row));
  const [pendingKey, setPendingKey] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);

  if (visibleActions.length === 0) return null;

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={actionsLabel(row, getRowLabel)}
          data-slot="crud-row-actions-trigger"
          disabled={pendingKey != null}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          size="icon-sm"
          type="button"
          variant="outline"
        >
          <DotsThreeIcon aria-hidden weight="bold" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        data-ui="crud-row-actions-menu"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        {visibleActions.map((action) => {
          const destructive = action.variant === 'destructive' || Boolean(action.confirm);
          return (
            <DropdownMenuItem
              disabled={pendingKey === action.key}
              key={action.key}
              onSelect={(event) => {
                if (action.confirm) {
                  onConfirmRequest(action, row);
                  return;
                }
                event.preventDefault();
                void (async () => {
                  setPendingKey(action.key);
                  try {
                    await action.onClick(row, listMutators);
                    setOpen(false);
                  } catch (err) {
                    toast.error(getMessageString(err, `${action.label} failed`));
                  } finally {
                    setPendingKey(null);
                  }
                })();
              }}
              variant={destructive ? 'destructive' : 'default'}
            >
              {action.icon}
              {pendingKey === action.key ? `${action.label}…` : action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
