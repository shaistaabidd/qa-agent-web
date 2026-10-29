import { CheckIcon } from '@phosphor-icons/react/Check';
import { CopyIcon } from '@phosphor-icons/react/Copy';
import { useEffect, useRef, useState } from 'react';

import { copyToClipboard } from '@/shared/lib/clipboard';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

type CopyInputProps = {
  value: string;
  editable?: boolean;
  onValueChange?: (value: string) => void;
  copyLabel?: string;
  copiedLabel?: string;
  failedLabel?: string;
  className?: string;
  inputClassName?: string;
  'aria-label'?: string;
};

function CopyInput({
  value,
  editable = false,
  onValueChange,
  copyLabel = 'Copy',
  copiedLabel = 'Copied!',
  failedLabel = 'Copy failed',
  className,
  inputClassName,
  'aria-label': ariaLabel = 'Value',
}: CopyInputProps) {
  const [status, setStatus] = useState<'copied' | 'failed' | 'idle'>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleCopy() {
    const ok = await copyToClipboard(value);
    setStatus(ok ? 'copied' : 'failed');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setStatus('idle'), 2000);
  }

  const copied = status === 'copied';
  const failed = status === 'failed';
  const buttonLabel = copied ? copiedLabel : failed ? failedLabel : copyLabel;

  return (
    <div className={cn('flex w-full items-center gap-[8px]', className)} data-slot="copy-input">
      <Input
        aria-label={ariaLabel}
        className={cn('min-w-0 flex-1', inputClassName)}
        onChange={
          editable && onValueChange ? (event) => onValueChange(event.target.value) : undefined
        }
        readOnly={!editable || !onValueChange}
        value={value}
      />
      <Button
        aria-label={copyLabel}
        className={failed ? 'text-fg-danger' : undefined}
        onClick={handleCopy}
        size="sm"
        type="button"
        variant="ghost"
      >
        {copied ? (
          <CheckIcon aria-hidden className="size-[14px]" weight="bold" />
        ) : (
          <CopyIcon aria-hidden className="size-[14px]" weight="regular" />
        )}
        <span aria-hidden className="sr-only sm:not-sr-only">
          {buttonLabel}
        </span>
      </Button>
      <span className="sr-only" role="status">
        {copied ? copiedLabel : failed ? failedLabel : ''}
      </span>
    </div>
  );
}

export { CopyInput };
export type { CopyInputProps };
