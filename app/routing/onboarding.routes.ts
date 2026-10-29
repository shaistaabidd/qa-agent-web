import { layout, route, type RouteConfig } from '@react-router/dev/routes';

export const onboardingRoutes = [
  layout('shell/auth/SetupLayout.tsx', { id: 'setup' }, [
    route('onboarding/step-1', 'routes/onboarding/onboarding-step-1.tsx'),
    route('onboarding/step-2', 'routes/onboarding/onboarding-step-2.tsx'),
  ]),
] satisfies RouteConfig;
