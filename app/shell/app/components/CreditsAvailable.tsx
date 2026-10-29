import { WalletIcon } from '@phosphor-icons/react/Wallet';

import { toAppRole, useAuthStore } from '@/features/auth';
import { Typography } from '@/shared/ui/Typography';

import { getAppCredits } from '../constants';

export function CreditsAvailable() {
  const credits = getAppCredits(toAppRole(useAuthStore((state) => state.role)));

  if (!credits) {
    return null;
  }

  return (
    <div className="px-[16px] pb-[8px] group-data-[collapsible=icon]:hidden">
      <div className="flex items-center gap-[12px] rounded-[12px] bg-bg-success-subtle px-[16px] py-[10px]">
        <span className="inline-flex size-[24px] shrink-0 items-center justify-center text-fg-primary [&_svg]:size-[24px]">
          <WalletIcon aria-hidden weight="regular" />
        </span>
        <div className="min-w-0 flex-1">
          <Typography
            as="p"
            className="truncate text-fg-secondary"
            fontWeight="medium"
            variant="caption"
          >
            {credits.label}
          </Typography>
          <Typography
            as="p"
            className="truncate text-fg-primary"
            fontWeight="semibold"
            variant="body3"
          >
            {credits.amount}
          </Typography>
        </div>
      </div>
    </div>
  );
}
