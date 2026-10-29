import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';

export type SkeletonShape = 'block' | 'text' | 'circle';

const SHAPE_CLASS: Record<SkeletonShape, string> = {
  block: 'rounded-[12px]',
  text: 'h-[12px] rounded-[8px]',
  circle: 'size-[40px] rounded-full',
};

function Skeleton({
  className,
  shape = 'block',
  ...props
}: ComponentProps<'div'> & { shape?: SkeletonShape }) {
  return (
    <div
      className={cn('animate-pulse bg-bg-muted', SHAPE_CLASS[shape], className)}
      data-shape={shape}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
