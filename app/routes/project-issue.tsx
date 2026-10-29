import { IssueDetailPage } from '@/features/findings';

import type { Route } from './+types/project-issue';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Issue | QA Agent' },
    { name: 'description', content: 'The evidence for one issue.' },
  ];
}

export default function ProjectIssue() {
  return <IssueDetailPage />;
}
