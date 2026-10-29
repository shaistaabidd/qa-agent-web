import { ArrowLeftIcon } from '@phosphor-icons/react/ArrowLeft';
import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { EnvelopeSimpleIcon } from '@phosphor-icons/react/EnvelopeSimple';
import { useNavigate } from 'react-router';

import { formatDateTime } from '@/shared/lib/dates';
import { DetailRow } from '@/shared/lib/DetailRow';
import { scrollbarClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { Typography } from '@/shared/ui/Typography';

import { EmailLogBody } from './components/EmailLogBody';
import { EmailLogStatusTag } from './components/EmailLogStatusTag';
import { EMAIL_LOGS_PATH } from './constants';
import { useEmailLogDetail } from './hooks/useEmailLogDetail';

function DetailHeader({ title }: { title: string }) {
  const navigate = useNavigate();

  return (
    <header className="flex min-h-[72px] items-center gap-[12px] px-[16px] md:px-[24px]">
      <Button
        aria-label="Back to email logs"
        onClick={() => navigate(EMAIL_LOGS_PATH)}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <ArrowLeftIcon aria-hidden weight="regular" />
      </Button>
      <Typography as="h1" className="truncate" fontWeight="semibold" variant="h6">
        {title}
      </Typography>
    </header>
  );
}

export function EmailLogDetailPage() {
  const { emailLog, error, loading } = useEmailLogDetail();

  if (loading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <CircleNotchIcon
          aria-label="Loading email log"
          className="size-[24px] animate-spin text-icon-medium"
          weight="regular"
        />
      </div>
    );
  }

  if (error || !emailLog) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <DetailHeader title="Email log" />
        <div className="flex flex-1 items-center justify-center p-[24px]">
          <EmptyState
            icon={<EnvelopeSimpleIcon aria-hidden weight="regular" />}
            subheading={error?.message || 'Unable to retrieve email log details. Please try again.'}
            title="Failed to load email log"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DetailHeader title={emailLog.subject || 'Email log'} />
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col gap-[16px] overflow-y-auto p-[16px] md:p-[24px]',
          scrollbarClass,
        )}
      >
        <div className="rounded-[12px] border border-low bg-surface-white px-[16px]">
          <DetailRow label="Recipient" value={emailLog.recipient} />
          <DetailRow label="Subject" value={emailLog.subject || 'N/A'} />
          <DetailRow label="Status">
            <EmailLogStatusTag status={emailLog.status} />
          </DetailRow>
          <DetailRow label="Mailer" value={emailLog.mailer} />
          <DetailRow label="Mailer method" value={emailLog.mailerMethod} />
          <DetailRow label="Sent at" value={formatDateTime(emailLog.sentAt)} />
          {emailLog.attempts ? (
            <DetailRow label="Attempts" value={String(emailLog.attempts)} />
          ) : null}
          {emailLog.errorMessage ? (
            <DetailRow label="Error message" value={emailLog.errorMessage} />
          ) : null}
        </div>
        <div className="rounded-[12px] border border-low bg-surface-white p-[16px]">
          <Typography as="h2" className="mb-[12px]" fontWeight="semibold" variant="body1">
            Email body
          </Typography>
          <EmailLogBody body={emailLog.body} />
        </div>
      </div>
    </div>
  );
}
