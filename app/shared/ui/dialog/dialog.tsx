import { XIcon } from '@phosphor-icons/react/X';
import {
  cloneElement,
  isValidElement,
  type MouseEvent,
  type ReactElement,
  useLayoutEffect,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Typography } from '@/shared/ui/Typography';

import {
  bodyClass,
  closeButtonClass,
  contentClass,
  contentSizeClass,
  footerActionsClass,
  footerClass,
  footerDefaultClass,
  footerStickyClass,
  headerClass,
  headerTextClass,
  mediaClass,
  mediaToneClass,
  overlayClass,
  portalClass,
} from './constants';
import type {
  DialogBodyProps,
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterActionsProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogHeaderTextProps,
  DialogMediaProps,
  DialogProps,
  DialogTitleProps,
  DialogTriggerProps,
} from './types';
import {
  composeEventHandlers,
  DialogContext,
  useDialog,
  useDialogContext,
  useDialogLock,
  useMounted,
  useOptionalDialogContext,
} from './use-dialog';

/** Compound dialog slots share overlay state and layout, so they stay in one file. */

export function Dialog({ children, defaultOpen, onOpenChange, open }: DialogProps) {
  const context = useDialog({ defaultOpen, onOpenChange, open });

  return <DialogContext.Provider value={context}>{children}</DialogContext.Provider>;
}

export function DialogTrigger({
  asChild = false,
  children,
  onClick,
  ...props
}: DialogTriggerProps) {
  const { onOpenChange, open } = useDialogContext();

  function handleClick() {
    onOpenChange(true);
  }

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{
      className?: string;
      onClick?: (event: MouseEvent<HTMLElement>) => void;
    }>;

    return cloneElement(child, {
      ...props,
      'aria-expanded': open,
      'aria-haspopup': 'dialog',
      'data-slot': 'dialog-trigger',
      ...child.props,
      className: cn(props.className, child.props.className) || undefined,
      onClick: composeEventHandlers(child.props.onClick, handleClick),
    } as typeof child.props);
  }

  return (
    <button
      aria-expanded={open}
      aria-haspopup="dialog"
      data-slot="dialog-trigger"
      onClick={composeEventHandlers(onClick, handleClick)}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

export function DialogClose({ asChild = false, children, onClick, ...props }: DialogCloseProps) {
  const { onOpenChange } = useDialogContext();

  function handleClick() {
    onOpenChange(false);
  }

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{
      className?: string;
      onClick?: (event: MouseEvent<HTMLElement>) => void;
    }>;

    return cloneElement(child, {
      ...props,
      'data-ui': 'dialog-close',
      ...child.props,
      className: cn(props.className, child.props.className) || undefined,
      onClick: composeEventHandlers(child.props.onClick, handleClick),
    } as typeof child.props);
  }

  return (
    <button
      data-slot="dialog-close"
      data-ui="dialog-close"
      onClick={composeEventHandlers(onClick, handleClick)}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

export function DialogContent({
  children,
  className,
  closeDisabled = false,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  showCloseButton = true,
  size = 'md',
  ...props
}: DialogContentProps) {
  const { descriptionId, hasDescription, onOpenChange, open, titleId } = useDialogContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();

  const canDismiss = !closeDisabled;

  useDialogLock(mounted && open, closeOnEscape && canDismiss, onOpenChange, contentRef);

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div className={portalClass} data-slot="dialog-portal">
      <div
        aria-hidden
        className={overlayClass}
        data-slot="dialog-overlay"
        onClick={closeOnOutsideClick && canDismiss ? () => onOpenChange(false) : undefined}
      />
      <div
        {...props}
        aria-describedby={hasDescription ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn(contentClass, contentSizeClass[size], className)}
        data-size={size}
        data-slot="dialog-content"
        ref={contentRef}
        role="dialog"
        tabIndex={-1}
      >
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

export function DialogHeader({ children, className, ...props }: DialogHeaderProps) {
  return (
    <div {...props} className={cn(headerClass, className)} data-slot="dialog-header">
      {children}
    </div>
  );
}

export function DialogHeaderText({ children, className, ...props }: DialogHeaderTextProps) {
  return (
    <div {...props} className={cn(headerTextClass, className)} data-slot="dialog-header-text">
      {children}
    </div>
  );
}

export function DialogTitle({ children, className, ...props }: DialogTitleProps) {
  const context = useOptionalDialogContext();

  return (
    <Typography
      {...props}
      as="h2"
      className={cn('text-heading-sm text-fg-default', className)}
      data-slot="dialog-title"
      fontWeight="semibold"
      id={context?.titleId ?? props.id}
    >
      {children}
    </Typography>
  );
}

export function DialogDescription({ children, className, ...props }: DialogDescriptionProps) {
  const context = useOptionalDialogContext();
  const registerDescription = context?.registerDescription;

  useLayoutEffect(() => registerDescription?.(), [registerDescription]);

  return (
    <Typography
      {...props}
      as="p"
      className={cn('text-fg-secondary', className)}
      data-slot="dialog-description"
      id={context?.descriptionId ?? props.id}
      size="sm"
      variant="body3"
    >
      {children}
    </Typography>
  );
}

export function DialogMedia({
  children,
  className,
  tone,
  variant = 'icon',
  ...props
}: DialogMediaProps) {
  return (
    <div
      {...props}
      className={cn(
        mediaClass[variant],
        variant === 'icon' && tone ? mediaToneClass[tone] : undefined,
        className,
      )}
      data-slot="dialog-media"
      data-tone={variant === 'icon' ? tone : undefined}
      data-variant={variant}
    >
      {children}
    </div>
  );
}

export function DialogBody({ children, className, ...props }: DialogBodyProps) {
  return (
    <div {...props} className={cn(bodyClass, className)} data-slot="dialog-body">
      {children}
    </div>
  );
}

export function DialogFooter({ children, className, sticky = false, ...props }: DialogFooterProps) {
  return (
    <div
      {...props}
      className={cn(footerClass, sticky ? footerStickyClass : footerDefaultClass, className)}
      data-slot="dialog-footer"
      data-sticky={sticky || undefined}
    >
      {children}
    </div>
  );
}

export function DialogFooterActions({ children, className, ...props }: DialogFooterActionsProps) {
  return (
    <div {...props} className={cn(footerActionsClass, className)} data-slot="dialog-footer-actions">
      {children}
    </div>
  );
}
