import type { Project } from './types';

/** Project admins and super admins may change a project; the API enforces the same rule. */
export function canManageProject(project: Project, isSuperAdmin: boolean) {
  return project.myRole === 'ADMIN' || isSuperAdmin;
}
