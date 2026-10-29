import { ProfileSetupForm } from '@/features/onboarding';

import type { Route } from './+types/profile-setup';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Profile Setup | SaaS Temp' },
    { name: 'description', content: 'Complete your profile to continue.' },
  ];
}

export default function ProfileSetup() {
  return <ProfileSetupForm />;
}
