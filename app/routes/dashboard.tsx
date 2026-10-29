import { DashboardPage } from '@/features/dashboard';

import type { Route } from './+types/dashboard';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dashboard | SaaS Temp' },
    {
      name: 'description',
      content: 'Your dashboard.',
    },
  ];
}

export default function Dashboard() {
  return <DashboardPage />;
}
