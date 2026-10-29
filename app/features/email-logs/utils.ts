import type { TagVariant } from '@/shared/ui/tag';

import type { EmailLogStatus } from './types';

export function emailLogStatusVariant(status: string): TagVariant {
  const normalized = status.toLowerCase();

  if (normalized === 'success') {
    return 'success';
  }

  if (normalized === 'failed') {
    return 'error';
  }

  return 'warning';
}

export function isEmailLogStatus(value: string): value is EmailLogStatus {
  return value === 'FAILED' || value === 'SUCCESS';
}

export type ParsedEmailBody = {
  hasHtml: boolean;
  hasText: boolean;
  htmlContent?: string;
  textContent?: string;
};

export function parseEmailBody(body: string): ParsedEmailBody {
  if (!body) {
    return { hasHtml: false, hasText: false };
  }

  let htmlContent = '';
  let textContent = '';

  try {
    const parts = body.split(/----==_mimepart_\w+_\w+/);

    for (const part of parts) {
      if (part.includes('Content-Type: text/html')) {
        const htmlMatch = part.match(/Content-Type: text\/html[^]*?\r\n\r\n([^]*?)(?=\r\n----|$)/);
        if (htmlMatch?.[1]) {
          htmlContent = decodeQuotedPrintable(htmlMatch[1].trim());
        }
      }

      if (part.includes('Content-Type: text/plain')) {
        const textMatch = part.match(/Content-Type: text\/plain[^]*?\r\n\r\n([^]*?)(?=\r\n----|$)/);
        if (textMatch?.[1]) {
          textContent = decodeQuotedPrintable(textMatch[1].trim());
        }
      }
    }

    if (!htmlContent && !textContent && body.trim()) {
      if (body.includes('<html') || body.includes('<!DOCTYPE')) {
        htmlContent = decodeQuotedPrintable(body);
      } else {
        textContent = decodeQuotedPrintable(body);
      }
    }
  } catch {
    textContent = decodeQuotedPrintable(body);
  }

  return {
    hasHtml: Boolean(htmlContent),
    hasText: Boolean(textContent),
    htmlContent: htmlContent || undefined,
    textContent: textContent || undefined,
  };
}

function decodeQuotedPrintable(content: string) {
  if (!content) {
    return '';
  }

  return content
    .replace(/=\r\n/g, '')
    .replace(/=([0-9A-F]{2})/gi, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)));
}
