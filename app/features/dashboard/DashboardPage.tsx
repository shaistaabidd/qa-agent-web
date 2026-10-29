import { useAuthStore } from '@/features/auth';

import { AdminDashboard } from './components/AdminDashboard';
import { PersonalDashboard } from './components/PersonalDashboard';
import { dashboardViewFor } from './utils';

export function DashboardPage() {
  const role = useAuthStore((state) => state.role);

  return dashboardViewFor(role) === 'admin' ? <AdminDashboard /> : <PersonalDashboard />;
}
