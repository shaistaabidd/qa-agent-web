import { Tag } from '@/shared/ui/tag';

import { smsLogStatusLabel, smsLogStatusVariant } from '../utils';

export function SmsLogStatusTag({ status }: { status: string }) {
  return <Tag variant={smsLogStatusVariant(status)}>{smsLogStatusLabel(status)}</Tag>;
}
