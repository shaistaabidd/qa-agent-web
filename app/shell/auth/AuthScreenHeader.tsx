import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';

import type { AuthScreenHeaderProps } from './types';

export function AuthScreenHeader({ aside, className, description, title }: AuthScreenHeaderProps) {
  const copy = (
    <div className={cn('flex min-w-0 flex-1 flex-col gap-[4px]', !aside && className)}>
      <Typography
        className="text-high"
        fontWeight="semibold"
        size={{ base: '2xl', xl: '3xl' }}
        variant="h1"
      >
        {title}
      </Typography>
      <Typography className="text-disabled" size={{ base: 'base', xl: 'lg' }}>
        {description}
      </Typography>
    </div>
  );

  if (!aside) {
    return copy;
  }

  return (
    <div className={cn('flex w-full items-center gap-[12px]', className)}>
      {copy}
      {aside}
    </div>
  );
}
