import { SetupAccountPage } from '@/features/onboarding';

import type { Route } from './+types/setup-account';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Set Up Your Account | SaaS Temp' },
    {
      name: 'description',
      content: 'Set your password to create your account',
    },
  ];
}

export default function SetupAccount() {
  return <SetupAccountPage />;
}
