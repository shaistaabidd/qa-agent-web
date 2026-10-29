import { useProject } from '@/features/projects';

import { FindingsList } from './components/FindingsList';

/** Sentry-style issues: the same problem across runs is one row, with how often it came up and whether it is new, ongoing, regressed or resolved. */
export function IssuesPage() {
  const project = useProject();

  return <FindingsList projectId={project.id} />;
}
