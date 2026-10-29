import './shared/styles/app.css';

import { NuqsAdapter } from 'nuqs/adapters/react-router/v8';
import { Outlet } from 'react-router';

import { ClientStateHydration } from '@/providers/ClientStateHydration';

export { links } from '@/shell/root/links';
export { RootErrorBoundary as ErrorBoundary } from '@/shell/root/RootErrorBoundary';
export { RootHydrateFallback as HydrateFallback } from '@/shell/root/RootHydrateFallback';
export { RootLayout as Layout } from '@/shell/root/RootLayout';

export default function App() {
  return (
    <NuqsAdapter>
      <ClientStateHydration />
      <Outlet />
    </NuqsAdapter>
  );
}
