import { type RefObject, useEffect } from 'react';

import { useLatestRef } from '@/shared/lib/use-latest-ref';

/** Closes the popover on an outside press or Escape without letting Escape reach a parent dialog. */
export function useDatePickerDismiss(
  open: boolean,
  rootRef: RefObject<HTMLElement | null>,
  setOpen: (open: boolean) => void,
) {
  const setOpenRef = useLatestRef(setOpen);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpenRef.current(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape' || event.defaultPrevented) {
        return;
      }

      // Capture phase plus preventDefault so a parent dialog sees the key as already handled.
      event.preventDefault();
      setOpenRef.current(false);
      rootRef.current?.querySelector<HTMLInputElement>('[data-slot="input"]')?.focus();
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [open, rootRef, setOpenRef]);
}
