import { SquaresFourIcon } from '@phosphor-icons/react/SquaresFour';

import { EmptyState } from '@/shared/ui/empty-state';
import { AppPageHeader } from '@/shell/app';

type DashboardPlaceholderProps = {
  description: string;
  subheading: string;
};

export function DashboardPlaceholder({ description, subheading }: DashboardPlaceholderProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppPageHeader description={description} title="Dashboard" />
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center p-[16px] md:p-[24px]">
        <EmptyState
          icon={<SquaresFourIcon aria-hidden weight="regular" />}
          subheading={subheading}
          title="Dashboard coming soon"
        />
      </div>
    </div>
  );
}
