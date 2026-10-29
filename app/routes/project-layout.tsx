import { ProjectLayoutPage } from '@/features/projects';

import type { Route } from './+types/project-layout';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Project | QA Agent' },
    { name: 'description', content: 'One project: its repository, runs and issues.' },
  ];
}

export default function ProjectLayout() {
  return <ProjectLayoutPage />;
}
