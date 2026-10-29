import { useCallback, useMemo, useSyncExternalStore } from 'react';

import type { CarouselApi } from './carousel';

const noopUnsubscribe = () => {};

export function isEditableTarget(target: EventTarget) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || Boolean(target.closest('input, textarea, select')))
  );
}

export function useCarouselState(api: CarouselApi) {
  const subscribe = useCallback(
    (notify: () => void) => {
      if (!api) return noopUnsubscribe;

      api.on('reInit', notify);
      api.on('select', notify);
      api.on('slidesInView', notify);

      return () => {
        api.off('reInit', notify);
        api.off('select', notify);
        api.off('slidesInView', notify);
      };
    },
    [api],
  );
  // The snapshot is a string so React can compare it by value.
  const snapshot = useSyncExternalStore(
    subscribe,
    () =>
      api
        ? `${api.canScrollPrev() ? 1 : 0}|${api.canScrollNext() ? 1 : 0}|${api.slidesInView().join(',')}`
        : '0|0|',
    () => '0|0|',
  );

  return useMemo(() => {
    const [prev, next, inView] = snapshot.split('|');

    return {
      canScrollNext: next === '1',
      canScrollPrev: prev === '1',
      slidesInView: inView ? inView.split(',').map(Number) : [],
    };
  }, [snapshot]);
}
