import { cn } from '@/shared/lib/utils';

import { AuthScreenHeader } from './AuthScreenHeader';
import type { AuthMessagePanelProps } from './types';

export function AuthMessagePanel({
  action,
  className,
  description,
  footer,
  icon,
  notice,
  title,
}: AuthMessagePanelProps) {
  return (
    <div className={cn('flex w-full flex-col gap-[24px] xl:gap-[32px]', className)}>
      <div className="flex flex-col gap-[16px]">
        <div className="flex size-[54px] items-center justify-center overflow-clip rounded-[16px] border border-primary bg-brand-25 text-icon-primary">
          {icon}
        </div>
        <AuthScreenHeader description={description} title={title} />
      </div>
      {notice}
      <div className="flex flex-col items-center gap-[16px]">
        {action}
        {footer}
      </div>
    </div>
  );
}
