import { RunsPage } from '@/features/runs';

import type { Route } from './+types/project-runs';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Runs | QA Agent' },
    { name: 'description', content: 'Dispatch and review runs.' },
  ];
}

export default function ProjectRuns() {
  return <RunsPage />;
}
