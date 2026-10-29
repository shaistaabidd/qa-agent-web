import { SignupPage } from '@/features/auth';

import type { Route } from './+types/signup';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sign Up | SaaS Temp' },
    {
      name: 'description',
      content: 'Create your account.',
    },
  ];
}

export default function Signup() {
  return <SignupPage />;
}
