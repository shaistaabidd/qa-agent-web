import {
  createContext,
  type RefObject,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { findNeighbor } from '@/shared/lib/focus';
import {
  bodyChildOf,
  inertSiblingsOf,
  isEscapeDeferred,
  pushOverlay,
  resolveReturnFocus,
} from '@/shared/lib/overlay-stack';
import { useLatestRef } from '@/shared/lib/use-latest-ref';

import { FOCUSABLE_SELECTOR } from './constants';
import type { DialogProps } from './types';

export type DialogContextValue = {
  descriptionId: string;
  hasDescription: boolean;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  registerDescription: () => () => void;
  titleId: string;
};

export const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialogContext() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('Dialog components must be used within <Dialog>.');
  }

  return context;
}

export function useOptionalDialogContext() {
  return useContext(DialogContext);
}

export function useDialog({
  defaultOpen = false,
  onOpenChange,
  open: openProp,
}: Pick<DialogProps, 'defaultOpen' | 'onOpenChange' | 'open'>) {
  const generatedId = useId();
  const isOpenControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isOpenControlled ? openProp : uncontrolledOpen;
  const descriptionCount = useRef(0);
  const [hasDescription, setHasDescription] = useState(false);
  const registerDescription = useCallback(() => {
    descriptionCount.current += 1;
    setHasDescription(true);
    return () => {
      descriptionCount.current = Math.max(0, descriptionCount.current - 1);
      if (descriptionCount.current === 0) setHasDescription(false);
    };
  }, []);

  const onOpenChangeRef = useLatestRef(onOpenChange);
  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!isOpenControlled) {
        setUncontrolledOpen(next);
      }

      onOpenChangeRef.current?.(next);
    },
    [isOpenControlled, onOpenChangeRef],
  );

  return useMemo<DialogContextValue>(
    () => ({
      descriptionId: `${generatedId}-description`,
      hasDescription,
      onOpenChange: handleOpenChange,
      open,
      registerDescription,
      titleId: `${generatedId}-title`,
    }),
    [generatedId, handleOpenChange, hasDescription, open, registerDescription],
  );
}

export { useMounted } from '@/shared/lib/use-mounted';

export function useDialogLock(
  open: boolean,
  closeOnEscape: boolean,
  onOpenChange: (open: boolean) => void,
  contentRef: RefObject<HTMLElement | null>,
  interactive = true,
) {
  const onOpenChangeRef = useLatestRef(onOpenChange);
  const closeOnEscapeRef = useLatestRef(closeOnEscape);
  const overlayRef = useRef<ReturnType<typeof pushOverlay> | null>(null);

  // The stack entry follows `interactive` so a drawer that is animating out stops answering keys.
  useLayoutEffect(() => {
    if (!open || !interactive) {
      return;
    }

    const overlay = pushOverlay();
    overlayRef.current = overlay;

    return () => {
      overlay.remove();
      overlayRef.current = null;
    };
  }, [interactive, open]);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    const previous = resolveReturnFocus(document.activeElement);
    const fallback = previous ? findNeighbor(previous) : null;
    const unlockScroll = lockDocumentScroll();
    const portalRoot = contentRef.current ? bodyChildOf(contentRef.current) : null;
    const restoreInert = portalRoot ? inertSiblingsOf(portalRoot) : null;

    const frame = requestAnimationFrame(() => {
      contentRef.current?.focus();
    });

    function onKeyDown(event: KeyboardEvent) {
      if ((event.defaultPrevented && !isEscapeDeferred(event)) || !overlayRef.current?.isTop()) {
        return;
      }

      if (event.key === 'Escape') {
        if (closeOnEscapeRef.current) {
          event.preventDefault();
          onOpenChangeRef.current(false);
        }

        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const node = contentRef.current;

      if (!node) {
        return;
      }

      const focusable = [...node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].filter(
        (element) =>
          element.tabIndex !== -1 &&
          !element.hasAttribute('disabled') &&
          element.getAttribute('aria-hidden') !== 'true',
      );

      if (focusable.length === 0) {
        event.preventDefault();
        node.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      // Shift+Tab from the container itself (tabIndex -1) would otherwise leave the dialog.
      if (event.shiftKey && (document.activeElement === first || document.activeElement === node)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      unlockScroll();
      restoreInert?.();
      // The control that opened the dialog may already be gone, such as a removed chip.
      // Another modal may still hold the page inert, in which case it keeps focus.
      const restore = [previous, fallback].find(
        (element) => element?.isConnected && !element.closest('[inert]'),
      );
      restore?.focus({ preventScroll: true });
    };
  }, [closeOnEscapeRef, contentRef, onOpenChangeRef, open]);
}

type DocumentScrollLock = {
  bodyLeft: string;
  bodyPaddingInlineEnd: string;
  bodyPosition: string;
  bodyRight: string;
  bodyTop: string;
  bodyWidth: string;
  scrollX: number;
  scrollY: number;
};

let documentScrollLockCount = 0;
let documentScrollLock: DocumentScrollLock | null = null;

function lockDocumentScroll() {
  const { body, documentElement } = document;

  if (documentScrollLockCount === 0) {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const scrollbarWidth = Math.max(0, window.innerWidth - documentElement.clientWidth);
    const paddingInlineEnd = parseFloat(getComputedStyle(body).paddingInlineEnd) || 0;

    documentScrollLock = {
      bodyLeft: body.style.left,
      bodyPaddingInlineEnd: body.style.paddingInlineEnd,
      bodyPosition: body.style.position,
      bodyRight: body.style.right,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      scrollX,
      scrollY,
    };

    // overflow:hidden on both <html> and <body> collapses the document and
    // resets window.scrollY. Pinning <body> keeps the page where it was.
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';

    if (scrollbarWidth > 0) {
      body.style.paddingInlineEnd = `${paddingInlineEnd + scrollbarWidth}px`;
    }
  }

  documentScrollLockCount += 1;
  let released = false;

  return () => {
    if (released) {
      return;
    }

    released = true;
    documentScrollLockCount -= 1;

    if (documentScrollLockCount > 0 || !documentScrollLock) {
      return;
    }

    const lock = documentScrollLock;
    documentScrollLock = null;
    body.style.position = lock.bodyPosition;
    body.style.top = lock.bodyTop;
    body.style.left = lock.bodyLeft;
    body.style.right = lock.bodyRight;
    body.style.width = lock.bodyWidth;
    body.style.paddingInlineEnd = lock.bodyPaddingInlineEnd;
    window.scrollTo(lock.scrollX, lock.scrollY);
  };
}

export function composeEventHandlers<E>(
  original?: (event: E) => void,
  handler?: (event: E) => void,
) {
  return (event: E) => {
    original?.(event);
    handler?.(event);
  };
}
