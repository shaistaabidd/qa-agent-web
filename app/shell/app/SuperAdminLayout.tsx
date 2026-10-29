import { Outlet } from 'react-router';

import { requireRoles } from '@/features/auth';
import { Role } from '@/shared/lib/constants';

export async function clientLoader({ request }: { request: Request }) {
  requireRoles(request, [Role.SUPER_ADMIN]);
  return null;
}

clientLoader.hydrate = true as const;

export function SuperAdminLayout() {
  return <Outlet />;
}

export default SuperAdminLayout;
