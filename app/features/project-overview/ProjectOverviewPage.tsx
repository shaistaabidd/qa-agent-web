import { GithubConnectCard } from '@/features/github-integration';
import { useProject } from '@/features/projects';

import { ClickUpCard } from './components/ClickUpCard';

export function ProjectOverviewPage() {
  const project = useProject();

  return (
    <div className="grid gap-[16px] lg:grid-cols-2">
      <GithubConnectCard project={project} />
      <ClickUpCard project={project} />
    </div>
  );
}
