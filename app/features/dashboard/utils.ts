import { normalizeUserType } from '@/features/auth';

export type DashboardView = 'admin' | 'personal';

const ADMIN_VIEW_ROLES = ['super_admin'];

export function dashboardViewFor(role: string | null): DashboardView {
  const userType = normalizeUserType(role);
  return userType && ADMIN_VIEW_ROLES.includes(userType) ? 'admin' : 'personal';
}
