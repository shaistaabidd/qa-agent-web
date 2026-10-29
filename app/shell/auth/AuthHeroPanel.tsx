import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';

import { AUTH_ASSETS } from './constants';
import type { AuthHeroPanelProps } from './types';

export function AuthHeroPanel({ className }: AuthHeroPanelProps) {
  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-dvh w-1/2 min-w-[240px] max-w-[567px] shrink-0 overflow-clip bg-amber-100 md:block',
        'rounded-l-[24px] lg:rounded-l-[32px] xl:rounded-l-[40px]',
        className,
      )}
    >
      <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-[74%] w-[93%] overflow-clip">
        <img alt="" className="size-full object-cover opacity-40" src={AUTH_ASSETS.pattern} />
      </div>
      <div className="absolute left-1/2 top-[10.94%] z-[2] h-[36px] w-[105px] -translate-x-1/2 overflow-clip lg:h-[44px] lg:w-[128px] xl:h-[52px] xl:w-[152px]">
        <img alt="" className="size-full object-contain" src={AUTH_ASSETS.avatars} />
      </div>
      <Typography
        className="absolute left-1/2 top-[23.14%] z-[2] w-[min(72.3%,410px)] -translate-x-1/2 px-[12px] text-center font-heading text-high"
        fontWeight="semibold"
        size={{ base: 'xl', lg: '2xl', xl: '3xl' }}
      >
        Everything you need to manage your platform, in one place
      </Typography>
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-[1] h-[56.84%] w-[152%] -translate-x-1/2 overflow-clip">
        <img alt="" className="size-full object-cover object-top" src={AUTH_ASSETS.professionals} />
      </div>
    </aside>
  );
}
