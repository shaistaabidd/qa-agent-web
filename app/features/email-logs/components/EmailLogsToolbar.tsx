import { FunnelIcon } from '@phosphor-icons/react/Funnel';

import { Button } from '@/shared/ui/button';
import { Search } from '@/shared/ui/search';

type EmailLogsToolbarProps = {
  activeFilterCount: number;
  canReset: boolean;
  onClearFilters: () => void;
  onOpenFilters: () => void;
};

export function EmailLogsToolbar({
  activeFilterCount,
  canReset,
  onClearFilters,
  onOpenFilters,
}: EmailLogsToolbarProps) {
  const hasFilters = activeFilterCount > 0;

  return (
    <div className="flex flex-wrap items-center gap-[8px]">
      <Search
        className="w-full max-w-[370px]"
        debounceMs={400}
        param="search"
        placeholder="Search email log by recipient"
        size="md"
      />
      <Button
        leftIcon={<FunnelIcon aria-hidden weight="regular" />}
        onClick={onOpenFilters}
        size="sm"
        type="button"
        variant="outline"
      >
        {hasFilters ? `Filter (${activeFilterCount})` : 'Filter'}
      </Button>
      <Button
        disabled={!canReset}
        onClick={onClearFilters}
        size="sm"
        type="button"
        variant="outline"
      >
        Reset
      </Button>
    </div>
  );
}
