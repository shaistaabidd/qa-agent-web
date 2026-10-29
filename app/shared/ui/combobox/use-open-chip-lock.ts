import { useLayoutEffect, useRef, useState } from 'react';

import { chipsLockClass } from './constants';

/** Freezes the chip area at its current height while the menu is open so the page does not jump. */
export function useOpenChipLock(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;

    if (!active || !node) {
      return;
    }

    const lockClasses = chipsLockClass.split(' ');

    node.style.height = `${node.offsetHeight}px`;
    node.classList.add(...lockClasses);

    return () => {
      node.style.height = '';
      node.classList.remove(...lockClasses);
    };
  }, [active]);

  return ref;
}

/** Whether the field had chips at the moment the menu opened. */
export function useOpenedWithItems(isOpen: boolean, count: number) {
  const [snapshot, setSnapshot] = useState({ isOpen, openedWith: isOpen && count > 0 });

  if (snapshot.isOpen !== isOpen) {
    setSnapshot({ isOpen, openedWith: isOpen && count > 0 });
  }

  return snapshot.openedWith && isOpen;
}
