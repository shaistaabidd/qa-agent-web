import { PlusIcon } from '@phosphor-icons/react/Plus';
import type * as React from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Search } from '@/shared/ui/search';
import { Segmented, SegmentedItem } from '@/shared/ui/segmented';

import type { CrudTab } from './types';

export type CrudToolbarProps = {
  searchParam?: string;
  searchDebounceMs?: number;
  searchPlaceholder?: string;
  showSearch?: boolean;
  addLabel?: string;
  onAdd?: () => void;
  toolbar?: React.ReactNode;
  tabs?: CrudTab[];
  activeTab?: string | null;
  onTabChange?: (value: string) => void;
  className?: string;
};

export function CrudToolbar({
  searchParam,
  searchDebounceMs,
  searchPlaceholder,
  showSearch = true,
  addLabel = 'Add',
  onAdd,
  toolbar,
  tabs,
  activeTab,
  onTabChange,
  className,
}: CrudToolbarProps) {
  const showTabs = Boolean(tabs?.length && onTabChange);
  const showSearchRow = showSearch || Boolean(toolbar) || Boolean(onAdd);

  if (!showTabs && !showSearchRow) return null;

  return (
    <div
      className={cn(
        'flex flex-col gap-[12px] border-b border-subtle px-[16px] py-[12px]',
        className,
      )}
      data-slot="crud-toolbar"
    >
      {showTabs ? (
        <Segmented
          aria-label="Filter list"
          onValueChange={onTabChange}
          value={activeTab ?? tabs![0]!.value}
        >
          {tabs!.map((tab) => (
            <SegmentedItem badge={tab.count} key={tab.value} value={tab.value}>
              {tab.label}
            </SegmentedItem>
          ))}
        </Segmented>
      ) : null}

      {showSearchRow ? (
        <div className="flex w-full flex-wrap items-center justify-between gap-[12px]">
          {showSearch ? (
            <Search
              className="w-full max-w-[280px]"
              debounceMs={searchDebounceMs}
              param={searchParam}
              placeholder={searchPlaceholder}
              size="sm"
            />
          ) : (
            <div className="flex-1" />
          )}
          <div className="flex flex-wrap items-center justify-end gap-[8px]">
            {toolbar}
            {onAdd ? (
              <Button onClick={onAdd} size="sm" type="button">
                <PlusIcon aria-hidden weight="bold" />
                {addLabel}
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
