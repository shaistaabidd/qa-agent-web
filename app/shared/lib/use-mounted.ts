import { useSyncExternalStore } from 'react';

const subscribeNothing = () => () => {};

/** `false` on the server and during hydration, `true` on every client render after. */
export function useMounted() {
  return useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
}
