import type { DialogContentProps, DialogProps } from '@/shared/ui/dialog';

export type DrawerPosition = 'bottom' | 'left' | 'right' | 'top';

export interface DrawerProps extends DialogProps {
  position?: DrawerPosition;
}

export interface DrawerContentProps extends DialogContentProps {
  position?: DrawerPosition;
  showHandle?: boolean;
}
