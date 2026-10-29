import { EnvelopeSimpleIcon } from '@phosphor-icons/react/EnvelopeSimple';
import { useState } from 'react';

import { scrollbarClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { Pagination } from '@/shared/ui/pagination';
import { AppPageHeader } from '@/shell/app/AppPageHeader';

import { EmailLogsFilterDrawer } from './components/EmailLogsFilterDrawer';
import { EmailLogsTable } from './components/EmailLogsTable';
import { EmailLogsToolbar } from './components/EmailLogsToolbar';
import { useEmailLogs } from './hooks/useEmailLogs';

export function EmailLogsPage() {
  const logs = useEmailLogs();
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppPageHeader description="Review emails sent from the platform." title="Email Logs" />
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col gap-[16px] overflow-y-auto p-[16px] md:p-[24px]',
          scrollbarClass,
        )}
      >
        <EmailLogsToolbar
          activeFilterCount={logs.activeFilterCount}
          canReset={logs.canReset}
          onClearFilters={logs.clearFilters}
          onOpenFilters={() => setFiltersOpen(true)}
        />
        {logs.error ? (
          <EmptyState
            icon={<EnvelopeSimpleIcon aria-hidden weight="regular" />}
            subheading={logs.error.message || 'Unable to load email logs. Please try again.'}
            title="Failed to load email logs"
          >
            <Button onClick={() => void logs.refetch()} size="sm" type="button" variant="outline">
              Retry
            </Button>
          </EmptyState>
        ) : (
          <>
            <EmailLogsTable emailLogs={logs.emailLogs} loading={logs.loading} />
            <Pagination
              itemLabel="emails"
              onPageChange={(nextPage) => {
                void logs.setPage(nextPage);
              }}
              page={logs.page}
              pageCount={logs.totalPages}
              showingFrom={logs.showingFrom}
              showingTo={logs.showingTo}
              total={logs.count}
            />
          </>
        )}
      </div>
      <EmailLogsFilterDrawer
        endDate={logs.endDate}
        key={filtersOpen ? 'open' : 'closed'}
        onApply={logs.applyFilters}
        onOpenChange={setFiltersOpen}
        onReset={logs.clearFilters}
        open={filtersOpen}
        startDate={logs.startDate}
        status={logs.status}
      />
    </div>
  );
}
