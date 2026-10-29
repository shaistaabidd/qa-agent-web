import { Link } from 'react-router';

import { cn } from '@/shared/lib/utils';
import { BrandLogo } from '@/shared/ui/brand-logo';

export function SidebarLogo({ className, to = '/' }: { className?: string; to?: string }) {
  return (
    <Link
      className={cn(
        'inline-flex shrink-0 text-[16px] group-data-[collapsible=icon]:hidden',
        className,
      )}
      data-slot="sidebar-logo"
      to={to}
    >
      <BrandLogo />
    </Link>
  );
}
