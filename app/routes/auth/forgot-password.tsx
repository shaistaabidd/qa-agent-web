import { ForgotPasswordPage } from '@/features/auth';

import type { Route } from './+types/forgot-password';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Forgot Password | QA Agent' },
    {
      name: 'description',
      content:
        'Enter your email address and we will send a verification code to reset your password.',
    },
  ];
}

export default function ForgotPassword() {
  return <ForgotPasswordPage />;
}
