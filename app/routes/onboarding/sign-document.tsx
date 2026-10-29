import { SignDocumentForm } from '@/features/onboarding';

import type { Route } from './+types/sign-document';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sign Document | SaaS Temp' },
    { name: 'description', content: 'Sign the required agreement.' },
  ];
}

export default function SignDocument() {
  return <SignDocumentForm />;
}
