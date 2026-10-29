import { type RefObject, useCallback, useLayoutEffect, useRef } from 'react';

/** Keeps the newest value in a ref so effects and listeners can read it without re-subscribing. */
export function useLatestRef<T>(value: T): RefObject<T> {
  const ref = useRef(value);

  useLayoutEffect(() => {
    ref.current = value;
  });

  return ref;
}

/** A function with a fixed identity that always calls the newest `callback`. */
export function useStableCallback<Args extends unknown[], Result>(
  callback: (...args: Args) => Result,
) {
  const ref = useLatestRef(callback);

  return useCallback((...args: Args) => ref.current(...args), [ref]);
}
