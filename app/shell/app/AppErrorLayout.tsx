import { Outlet } from 'react-router';

import { RootErrorBoundary } from '@/shell/root/RootErrorBoundary';

export function ErrorBoundary() {
  return <RootErrorBoundary fullPage={false} />;
}

export default function AppErrorLayout() {
  return <Outlet />;
}
