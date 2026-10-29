import { XIcon } from '@phosphor-icons/react/X';
import { useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogClose } from '@/shared/ui/dialog';
import {
  closeButtonClass,
  contentClass,
  contentSizeClass,
  overlayClass,
} from '@/shared/ui/dialog/constants';
import { useDialogContext, useDialogLock, useMounted } from '@/shared/ui/dialog/use-dialog';

import {
  drawerContentMotionClass,
  drawerContentPositionClass,
  drawerHandleClass,
  drawerOverlayMotionClass,
  drawerPortalClass,
} from './constants';
import type { DrawerContentProps, DrawerProps } from './types';
import { DrawerContext, useDrawerContext, useDrawerPresence } from './use-drawer';

export function Drawer({ children, position = 'right', ...props }: DrawerProps) {
  const value = useMemo(() => ({ position }), [position]);

  return (
    <DrawerContext.Provider value={value}>
      <Dialog {...props}>{children}</Dialog>
    </DrawerContext.Provider>
  );
}

export function DrawerContent({
  children,
  className,
  closeDisabled = false,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  position: positionProp,
  showCloseButton = true,
  showHandle,
  size = 'lg',
  ...props
}: DrawerContentProps) {
  const { descriptionId, hasDescription, onOpenChange, open, titleId } = useDialogContext();
  const drawer = useDrawerContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const position = positionProp ?? drawer?.position ?? 'right';
  const handleVisible = showHandle ?? position === 'bottom';
  const { present, state } = useDrawerPresence(open);

  const canDismiss = !closeDisabled;

  useDialogLock(
    mounted && present,
    closeOnEscape && canDismiss && open,
    onOpenChange,
    contentRef,
    open,
  );

  if (!mounted || !present) {
    return null;
  }

  return createPortal(
    <div className={drawerPortalClass[position]} data-slot="drawer-portal">
      <div
        aria-hidden
        className={cn(overlayClass, drawerOverlayMotionClass)}
        data-slot="drawer-overlay"
        data-state={state}
        onPointerDown={
          closeOnOutsideClick && canDismiss && open ? () => onOpenChange(false) : undefined
        }
      />
      <div
        {...props}
        aria-describedby={hasDescription ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn(
          contentClass,
          'group/drawer-content',
          drawerContentMotionClass[position],
          drawerContentPositionClass[position],
          position === 'left' || position === 'right' ? contentSizeClass[size] : undefined,
          className,
        )}
        data-position={position}
        data-size={size}
        data-slot="drawer-content"
        data-state={state}
        ref={contentRef}
        role="dialog"
        tabIndex={-1}
      >
        {handleVisible ? <div aria-hidden className={drawerHandleClass} /> : null}
        {showCloseButton ? (
          <DialogClose asChild>
            <Button
              aria-label="Close"
              className={closeButtonClass}
              disabled={closeDisabled}
              size="icon-sm"
              variant="ghost"
            >
              <XIcon aria-hidden weight="light" />
            </Button>
          </DialogClose>
        ) : null}
        {children}
      </div>
    </div>,
    document.body,
  );
}
