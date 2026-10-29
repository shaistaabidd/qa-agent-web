import { PaymentResultPanel } from '@/features/onboarding';

import type { Route } from './+types/payment-success';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Payment Successful | SaaS Temp' },
    { name: 'description', content: 'Your clinic subscription payment was successful.' },
  ];
}

export default function PaymentSuccess() {
  return <PaymentResultPanel success />;
}
