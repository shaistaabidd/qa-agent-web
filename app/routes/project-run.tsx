import { RunDetailPage } from '@/features/runs';

import type { Route } from './+types/project-run';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Run | QA Agent' }, { name: 'description', content: 'What one run found.' }];
}

export default function ProjectRun() {
  return <RunDetailPage />;
}
