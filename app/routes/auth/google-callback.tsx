import { GoogleCallbackPage } from '@/features/auth';

import type { Route } from './+types/google-callback';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Signing in with Google | QA Agent' },
    { name: 'description', content: 'Finishing your Google sign-in.' },
  ];
}

export default function GoogleCallback() {
  return <GoogleCallbackPage />;
}
