import { EyeIcon } from '@phosphor-icons/react/Eye';
import { FunnelIcon } from '@phosphor-icons/react/Funnel';
import { useMemo, useState } from 'react';

import { scrollbarClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { CrudScreen } from '@/shared/ui/crud';

import { SMS_LOG_COLUMNS } from './components/smsLogColumns';
import { SmsLogDetailDrawer } from './components/SmsLogDetailDrawer';
import { SmsLogsFilterDrawer } from './components/SmsLogsFilterDrawer';
import { useSmsLogFilters } from './hooks/useSmsLogFilters';
import { useSmsLogs } from './hooks/useSmsLogs';
import type { SmsLog } from './types';

export function SmsLogsPage() {
  const fetchPage = useSmsLogs();
  const logFilters = useSmsLogFilters();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const hasFilters = logFilters.activeFilterCount > 0;
  // A new array each render makes the table rebuild its cells, which drops the row menu trigger
  // and the focus that returns to it after the detail drawer closes.
  const actions = useMemo(
    () => [
      {
        icon: <EyeIcon aria-hidden className="size-[16px]" weight="regular" />,
        key: 'view',
        label: 'View',
        onClick: (row: SmsLog) => setSelectedId(row.id),
      },
    ],
    [],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col overflow-y-auto p-[16px] md:p-[24px]',
          scrollbarClass,
        )}
      >
        <CrudScreen<SmsLog>
          actions={actions}
          columns={SMS_LOG_COLUMNS}
          description="Review text messages sent from the platform."
          empty={{
            description: 'Try a different recipient, status, message type, or date range.',
            title: 'No SMS logs',
          }}
          entityLabel="SMS log"
          fetchPage={fetchPage}
          filters={logFilters.filters}
          getRowId={(row) => row.id}
          onRowClick={(row) => setSelectedId(row.id)}
          search={{ debounceMs: 400, placeholder: 'Search SMS log by recipient' }}
          title="SMS Logs"
          toolbar={
            <>
              <Button
                leftIcon={<FunnelIcon aria-hidden weight="regular" />}
                onClick={() => setFiltersOpen(true)}
                size="sm"
                type="button"
                variant="outline"
              >
                {hasFilters ? `Filter (${logFilters.activeFilterCount})` : 'Filter'}
              </Button>
              <Button
                disabled={!logFilters.canReset}
                onClick={logFilters.clearFilters}
                size="sm"
                type="button"
                variant="outline"
              >
                Reset
              </Button>
            </>
          }
        />
      </div>
      <SmsLogsFilterDrawer
        endDate={logFilters.endDate}
        key={filtersOpen ? 'open' : 'closed'}
        messageType={logFilters.messageType}
        onApply={logFilters.applyFilters}
        onOpenChange={setFiltersOpen}
        onReset={logFilters.clearFilters}
        open={filtersOpen}
        startDate={logFilters.startDate}
        status={logFilters.status}
      />
      <SmsLogDetailDrawer
        onOpenChange={(open) => {
          if (!open) {
            setSelectedId(null);
          }
        }}
        open={selectedId != null}
        smsLogId={selectedId}
      />
    </div>
  );
}
