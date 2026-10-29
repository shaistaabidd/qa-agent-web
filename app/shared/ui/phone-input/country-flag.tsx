import { useState } from 'react';

import { cn } from '@/shared/lib/utils';

import { usePhoneField } from './phone-field-context';
import { getFlagClassName, getFlagSrc } from './utils';

export function CountryFlag({ className, country }: { className?: string; country?: string }) {
  const { size } = usePhoneField();
  const src = getFlagSrc(country);
  const [failedSrc, setFailedSrc] = useState<string | undefined>();
  const showImage = Boolean(src) && src !== failedSrc;

  return (
    <span className={getFlagClassName(size, className)} data-slot="country-flag">
      {showImage ? (
        <img
          alt=""
          className={cn('absolute inset-0 size-full max-w-none')}
          onError={() => setFailedSrc(src)}
          src={src}
        />
      ) : null}
    </span>
  );
}
