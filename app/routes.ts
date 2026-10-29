import { type RouteConfig } from '@react-router/dev/routes';

import { appRoutes } from './routing/app.routes';
import { authRoutes } from './routing/auth.routes';
import { onboardingRoutes } from './routing/onboarding.routes';
import { publicRoutes } from './routing/public.routes';

export default [
  ...publicRoutes,
  ...authRoutes,
  ...onboardingRoutes,
  ...appRoutes,
] satisfies RouteConfig;
