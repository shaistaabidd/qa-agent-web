import { Outlet } from 'react-router';

import { requireGuest } from '@/features/auth';

import { AuthFrame } from './AuthFrame';
import type { AuthLayoutProps } from './types';

export async function clientLoader({ request }: { request: Request }) {
  requireGuest(request);
  return null;
}
clientLoader.hydrate = true as const;

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return <AuthFrame className={className}>{children ?? <Outlet />}</AuthFrame>;
}

export default AuthLayout;
