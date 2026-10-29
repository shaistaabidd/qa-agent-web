import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { TrashIcon } from '@phosphor-icons/react/Trash';
import { type ChangeEvent, type ReactNode, useEffect, useId, useRef, useState } from 'react';

import { moveFocus } from '@/shared/lib/focus';
import { cn } from '@/shared/lib/utils';
import type { AvatarShape, AvatarSize } from '@/shared/ui/avatar';
import { Avatar } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Typography } from '@/shared/ui/Typography';

export type ImageUploaderRemoveVariant = 'danger' | 'danger-icon' | 'ghost' | 'icon';

const ACCEPT = 'image/jpeg,image/png';
const MAX_SIZE_BYTES = 4 * 1024 * 1024;
const PREVIEW_ALT = 'Uploaded image';

function decodeImageUrl(file: File) {
  const url = URL.createObjectURL(file);

  return new Promise<string | null>((resolve) => {
    const image = new Image();

    image.onload = () => {
      if (image.naturalWidth > 0) {
        resolve(url);
        return;
      }

      URL.revokeObjectURL(url);
      resolve(null);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    image.src = url;
  });
}

export type ImageUploaderProps = {
  alt?: string;
  changeLabel?: string;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  name?: string;
  onChange: (url: string) => void;
  onFileChange?: (file: File) => void;
  onRemove?: () => void;
  pending?: boolean;
  removeLabel?: string;
  removeVariant?: ImageUploaderRemoveVariant;
  shape?: AvatarShape;
  size?: AvatarSize;
  uploadLabel?: string;
  value: string;
};

export function ImageUploader({
  alt = '',
  changeLabel = 'Change photo',
  children,
  className,
  disabled = false,
  name = 'image',
  onChange,
  onFileChange,
  onRemove,
  pending = false,
  removeLabel = 'Remove',
  removeVariant = 'icon',
  shape = 'rectangular',
  size = '56',
  uploadLabel = 'Upload Image',
  value,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const requestId = useRef(0);
  const errorId = useId();
  const [error, setError] = useState<string | null>(null);
  const hasValue = Boolean(value);
  const isDisabled = disabled || pending;
  const iconRemove = removeVariant === 'icon' || removeVariant === 'danger-icon';
  const removeButtonVariant =
    removeVariant === 'icon' ? 'ghost' : removeVariant === 'danger-icon' ? 'danger' : removeVariant;
  const previewAlt = alt.trim() || PREVIEW_ALT;

  function releaseObjectUrl() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }

  useEffect(() => releaseObjectUrl, []);

  function handleRemove() {
    if (isDisabled) {
      return;
    }

    requestId.current += 1;
    moveFocus(rootRef.current?.querySelector<HTMLElement>('[data-change-trigger]'));
    releaseObjectUrl();
    setError(null);

    if (onRemove) {
      onRemove();
      return;
    }
    onChange('');
  }

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (isDisabled) {
      return;
    }

    if (!file) {
      return;
    }

    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      setError('Please upload a JPEG or PNG image.');
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError('Please upload an image of 4MB or less.');
      return;
    }

    setError(null);

    const request = ++requestId.current;

    void decodeImageUrl(file).then((url) => {
      if (request !== requestId.current) {
        if (url) {
          URL.revokeObjectURL(url);
        }
        return;
      }

      if (!url) {
        setError('Please upload a valid JPEG or PNG image.');
        return;
      }

      if (onFileChange) {
        URL.revokeObjectURL(url);
        onFileChange(file);
        return;
      }

      releaseObjectUrl();
      objectUrlRef.current = url;
      onChange(url);
    });
  }

  return (
    <div className={cn('flex min-w-0 flex-wrap items-center gap-[8px]', className)} ref={rootRef}>
      <Avatar
        alt={hasValue ? previewAlt : ''}
        className="shrink-0"
        shape={shape}
        size={size}
        src={value || undefined}
      >
        {children}
      </Avatar>
      <div className="flex min-w-0 flex-wrap items-center gap-[8px]">
        <Button
          aria-busy={pending || undefined}
          aria-describedby={error ? errorId : undefined}
          data-change-trigger=""
          disabled={isDisabled}
          leftIcon={
            pending ? (
              <CircleNotchIcon aria-hidden className="animate-spin" weight="regular" />
            ) : undefined
          }
          onClick={() => inputRef.current?.click()}
          size="md"
          type="button"
          variant="outline"
        >
          {hasValue ? changeLabel : uploadLabel}
        </Button>
        {hasValue ? (
          <Button
            aria-label={iconRemove ? removeLabel : undefined}
            disabled={isDisabled}
            onClick={handleRemove}
            size={iconRemove ? 'icon-md' : 'md'}
            type="button"
            variant={removeButtonVariant}
          >
            {iconRemove ? <TrashIcon aria-hidden weight="regular" /> : removeLabel}
          </Button>
        ) : null}
        <input
          accept={ACCEPT}
          aria-hidden
          className="sr-only"
          disabled={isDisabled}
          name={name}
          onChange={handleUpload}
          ref={inputRef}
          tabIndex={-1}
          type="file"
        />
        {error ? (
          <Typography
            as="span"
            className="w-full text-fg-danger"
            id={errorId}
            role="status"
            size="xs"
          >
            {error}
          </Typography>
        ) : null}
      </div>
    </div>
  );
}
