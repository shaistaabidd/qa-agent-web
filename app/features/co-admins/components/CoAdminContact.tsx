import { TruncatedText } from '@/shared/ui/tooltip';
import { Typography } from '@/shared/ui/Typography';

import type { CoAdmin } from '../types';

export function CoAdminContact({ row }: { row: CoAdmin }) {
  return (
    <div className="flex min-w-0 flex-col">
      <Typography as="span" className="min-w-0" variant="body3">
        <TruncatedText>{row.email}</TruncatedText>
      </Typography>
    </div>
  );
}
