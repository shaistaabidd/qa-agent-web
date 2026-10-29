import { ChatTextIcon } from '@phosphor-icons/react/ChatText';
import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';

import { formatDateTime } from '@/shared/lib/dates';
import { DetailRow } from '@/shared/lib/DetailRow';
import { scrollbarClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerFooterActions,
  DrawerHeader,
  DrawerHeaderText,
  DrawerTitle,
} from '@/shared/ui/drawer';
import { EmptyState } from '@/shared/ui/empty-state';
import { Typography } from '@/shared/ui/Typography';

import { SMS_MESSAGE_TYPE_LABELS } from '../constants';
import { useSmsLogDetail } from '../hooks/useSmsLogDetail';
import { SmsLogStatusTag } from './SmsLogStatusTag';

type SmsLogDetailDrawerProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  smsLogId: string | null;
};

export function SmsLogDetailDrawer({ onOpenChange, open, smsLogId }: SmsLogDetailDrawerProps) {
  const { error, loading, smsLog } = useSmsLogDetail(smsLogId, open);
  const userName = [smsLog?.user?.firstName, smsLog?.user?.lastName].filter(Boolean).join(' ');

  return (
    <Drawer onOpenChange={onOpenChange} open={open} position="right">
      <DrawerContent size="lg">
        <DrawerHeader>
          <DrawerHeaderText>
            <DrawerTitle>SMS log details</DrawerTitle>
          </DrawerHeaderText>
        </DrawerHeader>
        <DrawerBody>
          {loading ? (
            <div className="flex flex-1 items-center justify-center py-[48px]">
              <CircleNotchIcon
                aria-label="Loading SMS log"
                className="size-[24px] animate-spin text-icon-medium"
                weight="regular"
              />
            </div>
          ) : error || !smsLog ? (
            <EmptyState
              icon={<ChatTextIcon aria-hidden weight="regular" />}
              subheading={error?.message || 'Unable to load SMS log details.'}
              title="No data available"
            />
          ) : (
            <div>
              <DetailRow label="Recipient" value={smsLog.recipient} />
              <DetailRow
                label="Message type"
                value={SMS_MESSAGE_TYPE_LABELS[smsLog.messageType] || smsLog.messageType}
              />
              <DetailRow label="Status">
                <SmsLogStatusTag status={smsLog.status} />
              </DetailRow>
              <DetailRow label="Sent at" value={formatDateTime(smsLog.sentAt)} />
              {smsLog.providerSid ? (
                <DetailRow label="Twilio SID" value={smsLog.providerSid} />
              ) : null}
              {smsLog.user ? (
                <DetailRow label="User">
                  <div className="flex flex-col sm:items-end">
                    {userName ? (
                      <Typography className="text-high" variant="body3">
                        {userName}
                      </Typography>
                    ) : null}
                    <Typography className="text-medium" variant="body3">
                      {smsLog.user.email}
                    </Typography>
                  </div>
                </DetailRow>
              ) : null}
              {smsLog.errorCode ? <DetailRow label="Error code" value={smsLog.errorCode} /> : null}
              {smsLog.errorMessage ? (
                <DetailRow
                  label="Error message"
                  value={smsLog.errorMessage}
                  valueClassName="text-error"
                />
              ) : null}
              {smsLog.body ? (
                <div className="flex flex-col gap-[8px] py-[12px]">
                  <Typography className="text-medium" variant="body3">
                    Message body
                  </Typography>
                  <pre
                    className={cn(
                      'max-h-[240px] overflow-auto rounded-[8px] bg-surface-background p-[12px] font-mono text-sm whitespace-pre-wrap text-high',
                      scrollbarClass,
                    )}
                  >
                    {smsLog.body}
                  </pre>
                </div>
              ) : null}
            </div>
          )}
        </DrawerBody>
        <DrawerFooter sticky>
          <DrawerFooterActions>
            <Button onClick={() => onOpenChange(false)} size="md" type="button" variant="outline">
              Close
            </Button>
          </DrawerFooterActions>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
