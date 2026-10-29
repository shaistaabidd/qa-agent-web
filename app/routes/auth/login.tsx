import { LoginPage } from '@/features/auth';

import type { Route } from './+types/login';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Login | QA Agent' },
    {
      name: 'description',
      content: 'Please enter your credentials to continue.',
    },
  ];
}

export default function Login() {
  return <LoginPage />;
}
