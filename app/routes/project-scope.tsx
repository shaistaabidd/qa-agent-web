import { ScopeFeaturesPage } from '@/features/scope-features';

import type { Route } from './+types/project-scope';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Scope features | QA Agent' },
    { name: 'description', content: 'What the worker may test.' },
  ];
}

export default function ProjectScope() {
  return <ScopeFeaturesPage />;
}
