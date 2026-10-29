import { FolderSimpleIcon } from '@phosphor-icons/react/FolderSimple';
import { useState } from 'react';

import { scrollbarClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { Pagination } from '@/shared/ui/pagination';
import { AppPageHeader } from '@/shell/app/AppPageHeader';

import { CreateProjectDialog } from './components/CreateProjectDialog';
import { ProjectsTable } from './components/ProjectsTable';
import { useProjects } from './hooks/useProjects';

export function ProjectsPage() {
  const projects = useProjects();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppPageHeader
        actions={
          <Button onClick={() => setCreateOpen(true)} size="md" type="button">
            New project
          </Button>
        }
        description="Each project is an app under test, with its repository, credentials, runs and issues."
        title="Projects"
      />
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col gap-[16px] overflow-y-auto p-[16px] md:p-[24px]',
          scrollbarClass,
        )}
      >
        {projects.error ? (
          <EmptyState
            icon={<FolderSimpleIcon aria-hidden weight="regular" />}
            subheading={projects.error.message || 'Unable to load projects. Please try again.'}
            title="Failed to load projects"
          >
            <Button
              onClick={() => void projects.refetch()}
              size="sm"
              type="button"
              variant="outline"
            >
              Retry
            </Button>
          </EmptyState>
        ) : (
          <>
            <ProjectsTable loading={projects.loading} projects={projects.projects} />
            <Pagination
              itemLabel="projects"
              onPageChange={(next) => void projects.setPage(next)}
              page={projects.page}
              pageCount={projects.totalPages}
              showingFrom={projects.showingFrom}
              showingTo={projects.showingTo}
              total={projects.count}
            />
          </>
        )}
      </div>
      <CreateProjectDialog onOpenChange={setCreateOpen} open={createOpen} />
    </div>
  );
}
