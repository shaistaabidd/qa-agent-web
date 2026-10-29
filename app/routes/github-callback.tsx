import { GithubCallbackPage } from '@/features/github-integration';

import type { Route } from './+types/github-callback';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Connecting GitHub | QA Agent' },
    { name: 'description', content: 'Finishing the GitHub connection.' },
  ];
}

export default function GithubCallback() {
  return <GithubCallbackPage />;
}
