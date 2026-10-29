import { CoAdminsPage } from '@/features/co-admins';

import type { Route } from './+types/co-admins';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Users | SaaS Temp' },
    {
      name: 'description',
      content: 'Invite and manage users.',
    },
  ];
}

export default function CoAdmins() {
  return <CoAdminsPage />;
}
