import { Typography } from '@/shared/ui/Typography';

import type { AppPageHeaderProps } from './types';

export function AppPageHeader({ description, title }: AppPageHeaderProps) {
  return (
    <header className="flex min-h-[72px] items-center px-[16px] py-[16px] md:px-[24px]">
      <div className="flex min-w-0 flex-col">
        <Typography as="h1" className="text-fg-default" fontWeight="semibold" variant="h6">
          {title}
        </Typography>
        <Typography className="text-fg-secondary" variant="body3">
          {description}
        </Typography>
      </div>
    </header>
  );
}
