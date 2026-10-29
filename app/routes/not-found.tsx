import { requireAuth } from '@/features/auth';
import { NotFoundPage } from '@/shell/not-found';

import type { Route } from './+types/not-found';

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  requireAuth(request, { rememberDestination: false });
  return null;
}
clientLoader.hydrate = true as const;

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Page Not Found | QA Agent' },
    {
      name: 'description',
      content: "The page you're looking for doesn't exist or may have moved.",
    },
  ];
}

export default function NotFound() {
  return <NotFoundPage />;
}
