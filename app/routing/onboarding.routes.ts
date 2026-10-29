import { layout, route, type RouteConfig } from '@react-router/dev/routes';

export const onboardingRoutes = [
  layout('shell/auth/SetupLayout.tsx', { id: 'setup' }, [
    route('onboarding/step-1', 'routes/onboarding/onboarding-step-1.tsx'),
    route('onboarding/step-2', 'routes/onboarding/onboarding-step-2.tsx'),
    route('profile-setup', 'routes/onboarding/profile-setup.tsx'),
    route('pricing', 'routes/onboarding/pricing.tsx'),
    route('sign-document', 'routes/onboarding/sign-document.tsx'),
    route('add-calendar', 'routes/onboarding/add-calendar.tsx'),
    route('payment-success', 'routes/onboarding/payment-success.tsx'),
    route('payment-failed', 'routes/onboarding/payment-failed.tsx'),
  ]),
] satisfies RouteConfig;
