import { IssuesPage } from '@/features/findings';

import type { Route } from './+types/project-issues';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Issues | QA Agent' },
    { name: 'description', content: 'Problems the worker found, grouped across runs.' },
  ];
}

export default function ProjectIssues() {
  return <IssuesPage />;
}
