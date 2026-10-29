import { OnboardingPhoneStep } from '@/features/onboarding';

import type { Route } from './+types/onboarding-step-2';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Phone number | SaaS Temp' },
    { name: 'description', content: 'Onboarding step 2: your phone number.' },
  ];
}

export default function OnboardingStep2() {
  return <OnboardingPhoneStep />;
}
