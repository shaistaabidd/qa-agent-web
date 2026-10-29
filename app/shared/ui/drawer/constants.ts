import type { DrawerPosition } from './types';

export const DRAWER_MOTION_MS = 300;

export const drawerOverlayMotionClass =
  'transition-opacity duration-300 ease-out motion-reduce:transition-none data-[state=closed]:opacity-0 data-[state=open]:opacity-100';

export const drawerContentMotionClass: Record<DrawerPosition, string> = {
  bottom:
    'transform-gpu transition-transform duration-300 ease-out motion-reduce:transition-none data-[state=closed]:translate-y-full',
  left: 'transform-gpu transition-transform duration-300 ease-out motion-reduce:transition-none data-[state=closed]:-translate-x-full',
  right:
    'transform-gpu transition-transform duration-300 ease-out motion-reduce:transition-none data-[state=closed]:translate-x-full',
  top: 'transform-gpu transition-transform duration-300 ease-out motion-reduce:transition-none data-[state=closed]:-translate-y-full',
};

export const drawerPortalClass: Record<DrawerPosition, string> = {
  bottom: 'fixed inset-0 z-(--z-modal) flex items-end justify-center p-[20px]',
  left: 'fixed inset-0 z-(--z-modal) flex items-stretch justify-start p-[20px]',
  right: 'fixed inset-0 z-(--z-modal) flex items-stretch justify-end p-[20px]',
  top: 'fixed inset-0 z-(--z-modal) flex items-start justify-center p-[20px]',
};

export const drawerContentPositionClass: Record<DrawerPosition, string> = {
  bottom: 'max-h-[80vh] rounded-b-none',
  left: 'h-full rounded-l-none',
  right: 'h-full rounded-r-none',
  top: 'max-h-[80vh] rounded-t-none',
};

export const drawerHandleClass =
  'mx-auto mt-[8px] h-[4px] w-[100px] shrink-0 rounded-full bg-border-default';
