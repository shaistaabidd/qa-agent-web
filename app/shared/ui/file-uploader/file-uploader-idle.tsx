import { UploadSimpleIcon } from '@phosphor-icons/react/UploadSimple';
import { type ChangeEventHandler, type DragEventHandler, type Ref, useId } from 'react';

import { Typography } from '@/shared/ui/Typography';

import {
  browseClass,
  DEFAULT_BROWSE_LABEL,
  DEFAULT_HELPER_TEXT,
  DEFAULT_TITLE,
  inputClass,
  sublineRowClass,
  textGroupClass,
} from './constants';
import type { FileUploaderProps } from './types';
import { getIdleClassName, getIdleIconClassName } from './utils';

type FileUploaderIdleProps = Pick<
  FileUploaderProps,
  'accept' | 'browseLabel' | 'className' | 'disabled' | 'helperText' | 'id' | 'name' | 'title'
> & {
  dragging: boolean;
  error?: string | null;
  inputRef?: Ref<HTMLInputElement>;
  onDragEnter?: DragEventHandler<HTMLLabelElement>;
  onDragLeave?: DragEventHandler<HTMLLabelElement>;
  onDragOver?: DragEventHandler<HTMLLabelElement>;
  onDrop?: DragEventHandler<HTMLLabelElement>;
  onInputChange?: ChangeEventHandler<HTMLInputElement>;
};

export function FileUploaderIdle({
  accept,
  browseLabel = DEFAULT_BROWSE_LABEL,
  className,
  disabled,
  dragging,
  error,
  helperText = DEFAULT_HELPER_TEXT,
  id,
  inputRef,
  name,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onInputChange,
  title = DEFAULT_TITLE,
}: FileUploaderIdleProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const idleState = dragging ? 'drag-over' : 'default';

  const body = (
    <>
      <span className={getIdleIconClassName(idleState)} data-slot="file-uploader-icon">
        <UploadSimpleIcon aria-hidden weight="regular" />
      </span>
      <span className={textGroupClass} data-slot="file-uploader-text">
        <Typography as="span" className="text-fg-default" fontWeight="medium" size="sm">
          {title}
        </Typography>
        <span className={sublineRowClass}>
          <Typography as="span" className="text-fg-secondary" size="sm">
            or
          </Typography>
          <Typography as="span" className={browseClass} fontWeight="medium" size="sm">
            {browseLabel}
          </Typography>
        </span>
      </span>
      {error ? (
        <Typography aria-hidden as="span" className="text-fg-danger" size="xs">
          {error}
        </Typography>
      ) : helperText != null && helperText !== '' ? (
        <Typography as="span" className="text-fg-secondary" size="xs">
          {helperText}
        </Typography>
      ) : null}
    </>
  );

  // The inline message is aria-hidden so it stays out of the label's accessible
  // name. This persistent polite region announces it once.
  const status = (
    <span className="sr-only" role="status">
      {error}
    </span>
  );

  if (disabled) {
    return (
      <>
        <div
          className={getIdleClassName(idleState, true, className)}
          data-slot="file-uploader"
          data-state={idleState}
        >
          {body}
        </div>
        {status}
      </>
    );
  }

  return (
    <>
      <label
        className={getIdleClassName(idleState, false, className)}
        data-slot="file-uploader"
        data-state={idleState}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        {body}
        <input
          accept={accept}
          className={inputClass}
          id={inputId}
          name={name}
          onChange={onInputChange}
          ref={inputRef}
          type="file"
        />
      </label>
      {status}
    </>
  );
}
