import { OnboardingProfileStep } from '@/features/onboarding';

import type { Route } from './+types/onboarding-step-1';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Your name | QA Agent' },
    { name: 'description', content: 'Onboarding step 1: your first and last name.' },
  ];
}

export default function OnboardingStep1() {
  return <OnboardingProfileStep />;
}
