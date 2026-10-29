import { CredentialsPage } from '@/features/credentials';

import type { Route } from './+types/project-credentials';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Credentials | QA Agent' },
    { name: 'description', content: 'Role credentials the worker signs in with.' },
  ];
}

export default function ProjectCredentials() {
  return <CredentialsPage />;
}
