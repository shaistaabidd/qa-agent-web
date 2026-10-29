import { ResetPasswordPage } from '@/features/auth';

import type { Route } from './+types/reset-password';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Reset Password | QA Agent' },
    {
      name: 'description',
      content: 'Create a new password for your account.',
    },
  ];
}

export default function ResetPassword() {
  return <ResetPasswordPage />;
}
