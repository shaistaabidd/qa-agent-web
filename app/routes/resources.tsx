import { ResourcesPage } from '@/features/resources';

import type { Route } from './+types/resources';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Resources | SaaS Temp' },
    {
      name: 'description',
      content: 'Manage resources available to clients.',
    },
  ];
}

export default function Resources() {
  return <ResourcesPage />;
}
