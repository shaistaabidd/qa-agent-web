import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';

import { useProject } from '@/features/projects';

import { CoverageCard } from './components/CoverageCard';
import { OpenIssuesCard } from './components/OpenIssuesCard';
import { useProjectDashboard } from './hooks/useProjectDashboard';

export function ProjectDashboardPage() {
  const project = useProject();
  const dashboard = useProjectDashboard(project.id);

  if (dashboard.loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <CircleNotchIcon
          aria-label="Loading dashboard"
          className="size-[24px] animate-spin text-icon-medium"
          weight="regular"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-[16px] lg:grid-cols-2">
      <CoverageCard coverage={dashboard.coverage} error={dashboard.coverageError} />
      <OpenIssuesCard error={dashboard.summaryError} summary={dashboard.summary} />
    </div>
  );
}
