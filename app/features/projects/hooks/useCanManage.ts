import { normalizeUserType, useAuthStore } from '@/features/auth';

import type { Project } from '../types';
import { canManageProject } from '../utils';

/** Whether the signed-in user may use the admin-only controls of this project. */
export function useCanManage(project: Project) {
  const role = useAuthStore((state) => normalizeUserType(state.user?.userType));

  return canManageProject(project, role === 'super_admin');
}
