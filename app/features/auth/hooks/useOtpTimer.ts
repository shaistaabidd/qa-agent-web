import { useSyncExternalStore } from 'react';

import { clearOtpTimer, remainingOtpSeconds, startOtpTimer } from '../otpTimer';

function subscribe(onStoreChange: () => void) {
  const intervalId = window.setInterval(() => {
    if (remainingOtpSeconds() === 0) {
      clearOtpTimer();
    }

    onStoreChange();
  }, 1000);

  function handleVisibilityChange() {
    if (!document.hidden) {
      onStoreChange();
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    window.clearInterval(intervalId);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}

export function useOtpTimer() {
  const remainingSeconds = useSyncExternalStore(subscribe, remainingOtpSeconds, () => 0);

  return {
    clear: clearOtpTimer,
    remainingSeconds,
    start: startOtpTimer,
  };
}
