import { createContext, useContext } from 'react';

export const SIDEBAR_WIDTH = '256px';
export const SIDEBAR_WIDTH_MOBILE = '280px';
export const SIDEBAR_WIDTH_ICON = '72px';
export const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

export type SidebarContextProps = {
  isMobile: boolean;
  open: boolean;
  openMobile: boolean;
  setOpen: (open: boolean) => void;
  setOpenMobile: (open: boolean) => void;
  state: 'collapsed' | 'expanded';
  toggleSidebar: () => void;
};

export const SidebarContext = createContext<SidebarContextProps | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
}
