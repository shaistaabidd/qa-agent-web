import { Avatar } from '@/shared/ui/avatar';
import { TruncatedText } from '@/shared/ui/tooltip';
import { Typography } from '@/shared/ui/Typography';

import type { CoAdmin } from '../types';
import { coAdminLabel, coAdminPhotoUrl } from '../utils';

export function CoAdminName({ row }: { row: CoAdmin }) {
  return (
    <div className="flex min-w-0 items-center gap-[12px]">
      <Avatar alt="" shape="circular" size="32" src={coAdminPhotoUrl(row) || undefined} />
      <Typography as="span" className="min-w-0" fontWeight="medium" variant="body3">
        <TruncatedText>{coAdminLabel(row)}</TruncatedText>
      </Typography>
    </div>
  );
}
