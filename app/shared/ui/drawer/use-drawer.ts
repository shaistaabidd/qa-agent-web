import { createContext, useContext, useEffect, useState } from 'react';

import { DRAWER_MOTION_MS } from './constants';
import type { DrawerPosition } from './types';

export type DrawerContextValue = {
  position: DrawerPosition;
};

export const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawerContext() {
  return useContext(DrawerContext);
}

export function useDrawerPresence(open: boolean) {
  const [present, setPresent] = useState(open);
  const [entered, setEntered] = useState(open);

  if (open && !present) {
    setPresent(true);
  }

  useEffect(() => {
    if (open) {
      let cancelled = false;
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) {
            setEntered(true);
          }
        });
      });

      return () => {
        cancelled = true;
        cancelAnimationFrame(frame);
      };
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeout = window.setTimeout(
      () => {
        setPresent(false);
        setEntered(false);
      },
      reduceMotion ? 0 : DRAWER_MOTION_MS,
    );

    return () => clearTimeout(timeout);
  }, [open]);

  return {
    present: present || open,
    state: open && entered ? ('open' as const) : ('closed' as const),
  };
}
