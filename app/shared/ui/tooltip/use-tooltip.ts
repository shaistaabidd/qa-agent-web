import {
  createContext,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

import { useLatestRef } from '@/shared/lib/use-latest-ref';

import { CLOSE_DELAY_DURATION, DEFAULT_DELAY_DURATION } from './constants';
import type { TooltipProps, TooltipProviderProps } from './types';

export type TooltipContextValue = {
  contentId: string;
  disabled: boolean;
  handleClose: () => void;
  handleOpen: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: RefObject<HTMLElement | null>;
};

export const TooltipContext = createContext<TooltipContextValue | null>(null);

export const TooltipDelayContext = createContext<number>(DEFAULT_DELAY_DURATION);

export function useTooltipContext() {
  const context = useContext(TooltipContext);

  if (!context) {
    throw new Error('Tooltip parts must be used within <Tooltip>.');
  }

  return context;
}

export function useTooltip({
  defaultOpen = false,
  delayDuration,
  disabled = false,
  onOpenChange,
  open: openProp,
}: Pick<TooltipProps, 'defaultOpen' | 'delayDuration' | 'disabled' | 'onOpenChange' | 'open'>) {
  const providerDelay = useContext(TooltipDelayContext);
  const resolvedDelay = delayDuration ?? providerDelay;
  const generatedId = useId();
  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? openProp : uncontrolledOpen;
  const triggerRef = useRef<HTMLElement | null>(null);
  const openTimerRef = useRef(0);
  const closeTimerRef = useRef(0);
  const onOpenChangeRef = useLatestRef(onOpenChange);
  const disabledRef = useLatestRef(disabled);
  const isControlledRef = useLatestRef(isControlled);

  const setOpen = useCallback(
    (next: boolean) => {
      if (disabledRef.current && next) {
        return;
      }

      if (!isControlledRef.current) {
        setUncontrolledOpen(next);
      }

      onOpenChangeRef.current?.(next);
    },
    [disabledRef, isControlledRef, onOpenChangeRef],
  );

  function clearTimers() {
    window.clearTimeout(openTimerRef.current);
    window.clearTimeout(closeTimerRef.current);
  }

  function handleOpen() {
    if (disabledRef.current) {
      return;
    }

    clearTimers();

    if (resolvedDelay <= 0) {
      setOpen(true);
      return;
    }

    openTimerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, resolvedDelay);
  }

  function handleClose() {
    window.clearTimeout(openTimerRef.current);
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
    }, CLOSE_DELAY_DURATION);
  }

  useEffect(() => {
    return () => {
      window.clearTimeout(openTimerRef.current);
      window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        // Capture phase and claimed, so Escape closes the tooltip before a dialog behind it.
        event.preventDefault();
        event.stopPropagation();
        window.clearTimeout(openTimerRef.current);
        window.clearTimeout(closeTimerRef.current);
        setOpen(false);
      }
    }

    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [open, setOpen]);

  return {
    contentId: `${generatedId}-content`,
    disabled,
    handleClose,
    handleOpen,
    open,
    setOpen,
    triggerRef,
  };
}

function subscribeNoop() {
  return () => {};
}

export function useMounted() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

export function getProviderDelay({
  delayDuration = DEFAULT_DELAY_DURATION,
}: Pick<TooltipProviderProps, 'delayDuration'>) {
  return delayDuration;
}
