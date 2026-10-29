export const PROJECTS_PATH = '/projects';
export const PROJECTS_PER_PAGE = 10;

/** One entry per project tab. `path` is the segment after `/projects/:projectId` ('' is the overview). */
export const PROJECT_TABS = [
  { label: 'Overview', path: '', value: 'overview' },
  { label: 'Credentials', path: 'credentials', value: 'credentials' },
  { label: 'Scope features', path: 'scope', value: 'scope' },
  { label: 'Runs', path: 'runs', value: 'runs' },
  { label: 'Issues', path: 'issues', value: 'issues' },
  { label: 'Dashboard', path: 'dashboard', value: 'dashboard' },
] as const;

export type ProjectTabValue = (typeof PROJECT_TABS)[number]['value'];

export function projectPath(projectId: string, path = '') {
  return path ? `${PROJECTS_PATH}/${projectId}/${path}` : `${PROJECTS_PATH}/${projectId}`;
}
