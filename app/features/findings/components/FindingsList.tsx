import { Pagination } from '@/shared/ui/pagination';

import { useFindings } from '../hooks/useFindings';
import { FindingsFilters } from './FindingsFilters';
import { FindingsTable } from './FindingsTable';

/** Filters, table and paging for a project's issues, or for one run's findings. */
export function FindingsList({ projectId, runId }: { projectId: string; runId?: string }) {
  const findings = useFindings(projectId, runId);

  return (
    <div className="flex flex-col gap-[12px]">
      <FindingsFilters filters={findings.filters} onChange={findings.setFilter} />
      {findings.error ? (
        <p className="text-error">{findings.error.message || 'Unable to load findings.'}</p>
      ) : (
        <>
          <FindingsTable
            findings={findings.findings}
            grouped={findings.grouped}
            loading={findings.loading}
            projectId={projectId}
          />
          <Pagination
            itemLabel={findings.grouped ? 'issues' : 'findings'}
            onPageChange={findings.setPage}
            page={findings.page}
            pageCount={findings.totalPages}
            showingFrom={findings.showingFrom}
            showingTo={findings.showingTo}
            total={findings.count}
          />
        </>
      )}
    </div>
  );
}
