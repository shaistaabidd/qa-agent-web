import { index, layout, route, type RouteConfig } from '@react-router/dev/routes';

export const appRoutes = [
  layout('shell/app/AppLayout.tsx', [
    layout('shell/app/AppErrorLayout.tsx', [
      route('projects', 'routes/projects.tsx'),
      route('projects/:projectId', 'routes/project-layout.tsx', [
        index('routes/project-overview.tsx'),
        route('credentials', 'routes/project-credentials.tsx'),
        route('scope', 'routes/project-scope.tsx'),
        route('runs', 'routes/project-runs.tsx'),
        route('runs/:runId', 'routes/project-run.tsx'),
        route('issues', 'routes/project-issues.tsx'),
        route('issues/:findingId', 'routes/project-issue.tsx'),
        route('dashboard', 'routes/project-dashboard.tsx'),
      ]),
      route('github/callback', 'routes/github-callback.tsx'),
      route('settings', 'routes/settings.tsx'),
      layout('shell/app/SuperAdminLayout.tsx', [
        route('email-logs', 'routes/email-logs.tsx'),
        route('email-logs/:id', 'routes/email-log-detail.tsx'),
        route('sms-logs', 'routes/sms-logs.tsx'),
        route('co-admin', 'routes/co-admins.tsx'),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
