import { DashboardPage } from '@/features/dashboard';

import type { Route } from './+types/dashboard';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dashboard | QA Agent' },
    {
      name: 'description',
      content: 'Your dashboard.',
    },
  ];
}

export default function Dashboard() {
  return <DashboardPage />;
}
