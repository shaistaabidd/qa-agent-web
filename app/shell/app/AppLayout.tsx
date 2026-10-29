import { Outlet } from 'react-router';

import { requireAuth } from '@/features/auth';

import { AppChrome } from './AppChrome';

export async function clientLoader({ request }: { request: Request }) {
  requireAuth(request);
  return null;
}
clientLoader.hydrate = true as const;

export function AppLayout() {
  return (
    <AppChrome>
      <Outlet />
    </AppChrome>
  );
}

export default AppLayout;
