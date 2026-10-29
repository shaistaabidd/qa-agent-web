import { PricingSetupPanel } from '@/features/onboarding';

import type { Route } from './+types/pricing';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Pricing | SaaS Temp' },
    { name: 'description', content: 'Choose a plan for your clinic.' },
  ];
}

export default function Pricing() {
  return <PricingSetupPanel />;
}
