import { useCanManage, useProject } from '@/features/projects';
import { FilterDropdown } from '@/shared/lib/FilterDropdown';
import { Pagination } from '@/shared/ui/pagination';
import { Typography } from '@/shared/ui/Typography';

import { DispatchRunCard } from './components/DispatchRunCard';
import { RunsTable } from './components/RunsTable';
import { RUN_STATUS_OPTIONS } from './constants';
import { useRuns } from './hooks/useRuns';

export function RunsPage() {
  const project = useProject();
  const canManage = useCanManage(project);
  const runs = useRuns(project.id);

  return (
    <>
      {canManage ? <DispatchRunCard projectId={project.id} /> : null}
      <div className="flex items-center justify-between gap-[12px]">
        <Typography as="h2" fontWeight="semibold" variant="body1">
          Run queue
        </Typography>
        <FilterDropdown
          label="Filter by status"
          onChange={runs.setStatus}
          options={RUN_STATUS_OPTIONS}
          value={runs.status}
        />
      </div>
      {runs.error ? (
        <p className="text-error">{runs.error.message || 'Unable to load runs.'}</p>
      ) : (
        <>
          <RunsTable loading={runs.loading} projectId={project.id} runs={runs.runs} />
          <Pagination
            itemLabel="runs"
            onPageChange={(next) => void runs.setPage(next)}
            page={runs.page}
            pageCount={runs.totalPages}
            showingFrom={runs.showingFrom}
            showingTo={runs.showingTo}
            total={runs.count}
          />
        </>
      )}
    </>
  );
}
