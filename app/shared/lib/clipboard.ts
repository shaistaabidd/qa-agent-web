import { type ExternalToast, toast } from '@/shared/ui/toast';

function copyWithTextarea(text: string): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

/** Copies text to the clipboard. Returns `true` when it succeeds. */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) {
    return false;
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Use the textarea fallback when the clipboard API is blocked.
    }
  }

  return copyWithTextarea(text);
}

/** Copies `text` and shows a success toast. No-ops when `text` is empty. */
export function copyWithToast(
  text: string | null | undefined,
  message: string,
  options?: ExternalToast,
): void {
  if (!text) {
    return;
  }

  void copyToClipboard(text).then((copied) => {
    if (copied) {
      toast.success(message, options);
    }
  });
}
