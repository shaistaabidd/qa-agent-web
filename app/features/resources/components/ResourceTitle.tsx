import { useLayoutEffect, useRef, useState } from 'react';

import { Tooltip } from '@/shared/ui/tooltip';

export function ResourceTitle({ title }: { title: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      setTruncated(el.scrollWidth > el.clientWidth);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [title]);

  return (
    <Tooltip content={title} disabled={!truncated}>
      <span className="block max-w-[140px] cursor-default truncate sm:max-w-[280px]" ref={ref}>
        {title}
      </span>
    </Tooltip>
  );
}
