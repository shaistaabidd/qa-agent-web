import { cn } from '@/shared/lib/utils';

import { rectangularRadiusClass, rootClass, sizeClass } from './constants';
import type { AvatarShape, AvatarSize } from './types';

export function getAvatarClassName(size: AvatarSize, shape: AvatarShape, className?: string) {
  return cn(
    rootClass,
    sizeClass[size],
    shape === 'circular' ? 'rounded-full' : rectangularRadiusClass[size],
    className,
  );
}

export function getInitials(children: unknown) {
  if (typeof children !== 'string') {
    return undefined;
  }

  const initials = children.trim();
  return initials.length > 0 ? initials : undefined;
}

export function isSvgSrc(src: string) {
  return /^data:image\/svg/i.test(src) || /\.svg(?:[?#]|$)/i.test(src);
}
