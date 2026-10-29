import { type ReactNode, useLayoutEffect, useRef, useState } from 'react';

import { cn } from '@/shared/lib/utils';

import { Tooltip } from './tooltip';

type TruncatedTextProps = {
  children: string;
  className?: string;
};

/** Single line of text that ends in "…" when it does not fit, with the full text in a tooltip. */
export function TruncatedText({ children, className }: TruncatedTextProps): ReactNode {
  const ref = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => setIsTruncated(element.scrollWidth > element.clientWidth);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [children]);

  return (
    <Tooltip content={<span className="break-all">{children}</span>} disabled={!isTruncated}>
      <span className={cn('block min-w-0 truncate', className)} ref={ref}>
        {children}
      </span>
    </Tooltip>
  );
}
