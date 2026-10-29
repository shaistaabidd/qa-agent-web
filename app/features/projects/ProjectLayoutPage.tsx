import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { FolderSimpleIcon } from '@phosphor-icons/react/FolderSimple';
import { Link, Outlet } from 'react-router';

import { scrollbarClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';

import { ProjectHeader } from './components/ProjectHeader';
import { ProjectTabs } from './components/ProjectTabs';
import { PROJECTS_PATH } from './constants';
import { useProjectData } from './hooks/useProjectData';

export function ProjectLayoutPage() {
  const { error, loading, project } = useProjectData();

  if (loading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <CircleNotchIcon
          aria-label="Loading project"
          className="size-[24px] animate-spin text-icon-medium"
          weight="regular"
        />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center p-[24px]">
        <EmptyState
          icon={<FolderSimpleIcon aria-hidden weight="regular" />}
          subheading="It may have been removed, or you may not have access to it."
          title="Project not found"
        >
          <Button asChild size="sm" variant="outline">
            <Link to={PROJECTS_PATH}>Back to projects</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ProjectHeader project={project} />
      <div className="px-[16px] pt-[12px] md:px-[24px]">
        <ProjectTabs projectId={project.id} />
      </div>
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col gap-[16px] overflow-y-auto p-[16px] md:p-[24px]',
          scrollbarClass,
        )}
      >
        <Outlet context={project} />
      </div>
    </div>
  );
}
