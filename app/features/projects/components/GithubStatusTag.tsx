import { Tag } from '@/shared/ui/tag';

import type { Project } from '../types';

export function GithubStatusTag({ project }: { project: Project }) {
  return project.repoConnected ? (
    <Tag variant="success">GitHub connected</Tag>
  ) : (
    <Tag variant="default">GitHub not connected</Tag>
  );
}
