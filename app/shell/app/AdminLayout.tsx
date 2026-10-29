import { Outlet } from 'react-router';

import { requireRoles } from '@/features/auth';
import { Role } from '@/shared/lib/constants';

const ADMIN_ROLES = [Role.SUPER_ADMIN, Role.TEAM_MEMBER];

export async function clientLoader({ request }: { request: Request }) {
  requireRoles(request, ADMIN_ROLES);
  return null;
}

clientLoader.hydrate = true as const;

export function AdminLayout() {
  return <Outlet />;
}

export default AdminLayout;
