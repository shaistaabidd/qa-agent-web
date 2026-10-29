import { PaymentResultPanel } from '@/features/onboarding';

import type { Route } from './+types/payment-failed';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Payment Failed | SaaS Temp' },
    { name: 'description', content: 'Your clinic subscription payment did not complete.' },
  ];
}

export default function PaymentFailed() {
  return <PaymentResultPanel success={false} />;
}
