import { ProjectOverviewPage } from '@/features/project-overview';

import type { Route } from './+types/project-overview';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Overview | QA Agent' },
    { name: 'description', content: 'Connect GitHub and ClickUp.' },
  ];
}

export default function ProjectOverview() {
  return <ProjectOverviewPage />;
}
