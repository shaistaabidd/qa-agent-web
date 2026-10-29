import { SettingsPage } from '@/features/settings';

import type { Route } from './+types/settings';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Account Settings | QA Agent' },
    {
      name: 'description',
      content: 'Manage your general profile details and login email address.',
    },
  ];
}

export default function Settings() {
  return <SettingsPage />;
}
