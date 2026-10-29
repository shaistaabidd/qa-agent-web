import { layout, route, type RouteConfig } from '@react-router/dev/routes';

export const authRoutes = [
  layout('shell/auth/AuthLayout.tsx', { id: 'auth' }, [
    route('login', 'routes/auth/login.tsx'),
    route('otp', 'routes/auth/otp.tsx'),
    route('forgot-password', 'routes/auth/forgot-password.tsx'),
    route('reset-password', 'routes/auth/reset-password.tsx'),
    route('reset-password/success', 'routes/auth/reset-password.success.tsx'),
    route('signup', 'routes/auth/signup.tsx'),
    route('setup-account', 'routes/auth/setup-account.tsx'),
    route('set-password', 'routes/auth/set-password.tsx'),
    route('invite-expired', 'routes/auth/invite-expired.tsx'),
    route('auth/google/callback', 'routes/auth/google-callback.tsx'),
  ]),
] satisfies RouteConfig;
