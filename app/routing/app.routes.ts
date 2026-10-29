import { layout, route, type RouteConfig } from '@react-router/dev/routes';

export const appRoutes = [
  layout('shell/app/AppLayout.tsx', [
    layout('shell/app/AppErrorLayout.tsx', [
      route('dashboard', 'routes/dashboard.tsx'),
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
