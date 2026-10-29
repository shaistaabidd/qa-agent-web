import { scrollbarClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';

import { parseEmailBody } from '../utils';
import { EmailLogHtmlFrame } from './EmailLogHtmlFrame';

export function EmailLogBody({ body }: { body?: string | null }) {
  const parsed = body ? parseEmailBody(body) : null;

  if (!parsed) {
    return (
      <Typography className="text-medium" variant="body2">
        No email body content available
      </Typography>
    );
  }

  if (parsed.hasHtml && parsed.htmlContent) {
    return <EmailLogHtmlFrame html={parsed.htmlContent} />;
  }

  if (parsed.hasText && parsed.textContent) {
    return (
      <pre
        className={cn(
          'max-h-[480px] overflow-auto font-mono text-sm whitespace-pre-wrap text-high',
          scrollbarClass,
        )}
      >
        {parsed.textContent}
      </pre>
    );
  }

  return (
    <pre
      className={cn(
        'max-h-[480px] overflow-auto font-mono text-sm whitespace-pre-wrap text-high',
        scrollbarClass,
      )}
    >
      {body}
    </pre>
  );
}
