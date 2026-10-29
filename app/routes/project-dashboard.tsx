import { ProjectDashboardPage } from '@/features/qa-dashboard';

import type { Route } from './+types/project-dashboard';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dashboard | QA Agent' },
    { name: 'description', content: 'Coverage and open issues.' },
  ];
}

export default function ProjectDashboard() {
  return <ProjectDashboardPage />;
}
