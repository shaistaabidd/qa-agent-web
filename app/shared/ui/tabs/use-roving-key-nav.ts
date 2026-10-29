import { useEffect, useRef } from 'react';

import { useLatestRef } from '@/shared/lib/use-latest-ref';

const NAV_KEYS = new Set(['ArrowRight', 'ArrowLeft', 'Home', 'End']);

function isFocusable(item: HTMLElement) {
  return !item.hasAttribute('disabled') && item.getAttribute('aria-disabled') !== 'true';
}

export function useRovingKeyNav<T extends HTMLElement>({
  onSelect,
  slot,
}: {
  onSelect: (value: string) => void;
  slot: string;
}) {
  const rootRef = useRef<T>(null);
  const onSelectRef = useLatestRef(onSelect);
  const selector = `[data-slot="${slot}"]`;

  // Keep exactly one tab stop: the selected item, otherwise the first enabled one.
  useEffect(() => {
    const items = [...(rootRef.current?.querySelectorAll<HTMLElement>(selector) ?? [])].filter(
      (item) => item.dataset.value !== undefined,
    );
    const stop = items.find((item) => item.hasAttribute('data-selected') && isFocusable(item));
    const target = stop ?? items.find(isFocusable);

    for (const item of items) {
      item.tabIndex = item === target ? 0 : -1;
    }
  });

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (!root || !NAV_KEYS.has(event.key)) {
        return;
      }

      const items = [...root.querySelectorAll<HTMLElement>(selector)].filter(
        (item) => item.dataset.value !== undefined && isFocusable(item),
      );

      if (items.length === 0) {
        return;
      }

      const isRtl = getComputedStyle(root).direction === 'rtl';
      const forwardKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
      const target = event.target as Node;
      const currentIndex = items.findIndex((item) => item === target || item.contains(target));
      let nextIndex = currentIndex;

      if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = items.length - 1;
      } else if (event.key === forwardKey) {
        nextIndex = (Math.max(currentIndex, 0) + 1) % items.length;
      } else {
        nextIndex = (currentIndex <= 0 ? items.length : currentIndex) - 1;
      }

      const next = items[nextIndex];
      const nextValue = next?.dataset.value;

      if (!next || !nextValue) {
        return;
      }

      event.preventDefault();
      next.focus();
      onSelectRef.current(nextValue);
    }

    root.addEventListener('keydown', handleKeyDown);

    return () => root.removeEventListener('keydown', handleKeyDown);
  }, [onSelectRef, selector]);

  return { rootRef };
}
