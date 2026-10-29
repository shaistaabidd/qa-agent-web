import { useLayoutEffect, useRef, useState } from 'react';

import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';

import {
  imageClass,
  initialsSize,
  initialsVariant,
  toneClass,
  UNKNOWN_SRC,
  unknownClass,
} from './constants';
import type { AvatarProps } from './types';
import { getAvatarClassName, getInitials, isSvgSrc } from './utils';

export function Avatar({
  alt = '',
  children,
  className,
  shape = 'circular',
  size = '40',
  src,
  tone = 'brand',
  ...props
}: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const [unknownFailed, setUnknownFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const unknownRef = useRef<HTMLImageElement>(null);
  const showImage = Boolean(src) && src !== failedSrc;
  const initials = getInitials(children);

  useLayoutEffect(() => {
    const image = imageRef.current;

    // Load and error events that fire before hydration are not replayed.
    // A broken src can fall back here; a photo that already loaded stays visible.
    // SVGs without intrinsic dimensions report naturalWidth 0 even when loaded.
    if (image && src && image.complete && image.naturalWidth === 0 && !isSvgSrc(src)) {
      setFailedSrc(src);
    }
  }, [src]);

  useLayoutEffect(() => {
    const unknown = unknownRef.current;

    if (unknown && unknown.complete && unknown.naturalWidth === 0) {
      setUnknownFailed(true);
    }
  }, [unknownFailed]);

  return (
    <span
      {...props}
      className={cn(
        getAvatarClassName(size, shape, className),
        !showImage && initials && toneClass[tone],
        !showImage && !initials && !children && unknownClass,
      )}
      data-shape={shape}
      data-size={size}
      data-slot="avatar"
      data-tone={!showImage && initials ? tone : undefined}
    >
      {showImage ? (
        <img
          ref={imageRef}
          alt={alt}
          className={imageClass}
          onError={() => setFailedSrc(src)}
          src={src}
        />
      ) : initials ? (
        <Typography
          as="span"
          className={cn('block max-w-full', initials.length > 2 ? 'truncate' : 'whitespace-nowrap')}
          title={initials}
          fontWeight="medium"
          size={initialsSize[size]}
          variant={initialsVariant[size]}
        >
          {initials}
        </Typography>
      ) : children ? (
        children
      ) : unknownFailed ? null : (
        <img
          alt=""
          className={imageClass}
          onError={() => setUnknownFailed(true)}
          ref={unknownRef}
          src={UNKNOWN_SRC}
        />
      )}
    </span>
  );
}
