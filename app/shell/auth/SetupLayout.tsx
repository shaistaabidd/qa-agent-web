import { Outlet } from 'react-router';

import { requireSetup } from '@/features/auth';

import { ImpersonationBanner } from '../app/components/ImpersonationBanner';
import { AuthFrame } from './AuthFrame';

export async function clientLoader({ request }: { request: Request }) {
  requireSetup(request);
  return null;
}
clientLoader.hydrate = true as const;

export default function SetupLayout() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <ImpersonationBanner />
      <AuthFrame className="h-auto min-h-0 flex-1" linkLogo={false}>
        <Outlet />
      </AuthFrame>
    </div>
  );
}
