import type { ReactNode } from 'react';

import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar';
import { TooltipProvider } from '@/shared/ui/tooltip';

import { AppMobileHeader } from './AppMobileHeader';
import { AppSidebar } from './AppSidebar';
import { ImpersonationBanner } from './components/ImpersonationBanner';

type AppChromeProps = {
  children: ReactNode;
};

export function AppChrome({ children }: AppChromeProps) {
  return (
    <TooltipProvider>
      <SidebarProvider className="h-dvh! min-h-dvh! animate-in overflow-hidden fade-in duration-200">
        <AppSidebar />
        <SidebarInset className="h-full min-h-0 overflow-hidden bg-bg-canvas">
          <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
            <ImpersonationBanner />
            <AppMobileHeader />
            <div className="mx-auto flex min-h-0 w-full max-w-[1196px] flex-1 flex-col overflow-hidden">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
