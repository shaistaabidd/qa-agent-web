import { OtpPage } from '@/features/auth';

import type { Route } from './+types/otp';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Two-Factor Authentication | QA Agent' },
    {
      name: 'description',
      content: 'Enter your 6-digit verification code',
    },
  ];
}

export default function Otp() {
  return <OtpPage />;
}
