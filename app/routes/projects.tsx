import { ProjectsPage } from '@/features/projects';

import type { Route } from './+types/projects';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Projects | QA Agent' },
    { name: 'description', content: 'Your projects: apps under test.' },
  ];
}

export default function Projects() {
  return <ProjectsPage />;
}
