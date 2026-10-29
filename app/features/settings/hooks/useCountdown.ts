import { useEffect, useState } from 'react';

export function useCountdown(seconds: number) {
  const [deadline, setDeadline] = useState(() => Date.now() + seconds * 1000);
  const [now, setNow] = useState(() => Date.now());
  const remainingSeconds = Math.max(0, Math.ceil((deadline - now) / 1000));
  const expired = remainingSeconds === 0;

  useEffect(() => {
    if (expired) {
      return;
    }

    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(intervalId);
  }, [expired]);

  function reset() {
    const current = Date.now();

    setDeadline(current + seconds * 1000);
    setNow(current);
  }

  return { remainingSeconds, reset };
}
