import { PasswordResetSuccess } from '@/features/auth';

import type { Route } from './+types/reset-password.success';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Password Reset Successfully | SaaS Temp' },
    {
      name: 'description',
      content:
        'Your password has been successfully reset. You can now sign in with your new password.',
    },
  ];
}

export default function ResetPasswordSuccess() {
  return <PasswordResetSuccess />;
}
