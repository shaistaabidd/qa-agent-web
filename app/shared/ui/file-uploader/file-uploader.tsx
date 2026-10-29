import { useLayoutEffect, useRef } from 'react';

import { moveFocus } from '@/shared/lib/focus';

import { DEFAULT_ACCEPT, DEFAULT_MAX_SIZE_BYTES } from './constants';
import { FileUploaderFile } from './file-uploader-file';
import { FileUploaderIdle } from './file-uploader-idle';
import type { FileUploaderProps } from './types';
import { useFileUploader } from './use-file-uploader';
import { downloadFile, isIdleState } from './utils';

export function FileUploader({
  accept = DEFAULT_ACCEPT,
  browseLabel,
  className,
  disabled,
  fileName,
  fileSize,
  helperText,
  id,
  maxSizeBytes = DEFAULT_MAX_SIZE_BYTES,
  name,
  onCancel,
  onDownload,
  onFileChange,
  onRemove,
  onUpload,
  progress,
  state: stateProp,
  title,
  uploadUrl,
  ...props
}: FileUploaderProps) {
  const live = useFileUploader({
    accept,
    disabled,
    maxSizeBytes,
    onFileChange,
    onUpload,
    uploadUrl,
  });
  const state = live.state === 'default' && stateProp !== undefined ? stateProp : live.state;
  const returnFocusToIdle = useRef(false);

  function dismiss(action: (() => void) | undefined, fallback: () => void) {
    returnFocusToIdle.current = true;
    (action ?? fallback)();
  }

  useLayoutEffect(() => {
    if (!returnFocusToIdle.current) {
      return;
    }

    returnFocusToIdle.current = false;

    if (isIdleState(state)) {
      moveFocus(live.inputRef.current);
    }
  }, [live.inputRef, state]);

  if (!isIdleState(state)) {
    return (
      <FileUploaderFile
        className={className}
        fileName={fileName ?? live.file?.name}
        fileSize={fileSize ?? live.file?.size}
        onCancel={() => dismiss(onCancel, live.clear)}
        onDownload={
          onDownload ??
          (() => {
            if (live.file) {
              downloadFile(live.file);
            }
          })
        }
        onRemove={() => dismiss(onRemove, live.clear)}
        progress={progress ?? live.progress}
        state={state}
        {...props}
      />
    );
  }

  return (
    <FileUploaderIdle
      accept={accept}
      browseLabel={browseLabel}
      className={className}
      disabled={disabled}
      dragging={state === 'drag-over'}
      error={live.error}
      helperText={helperText}
      id={id}
      inputRef={live.inputRef}
      name={name}
      onDragEnter={live.onDragEnter}
      onDragLeave={live.onDragLeave}
      onDragOver={live.onDragOver}
      onDrop={live.onDrop}
      onInputChange={live.onInputChange}
      title={title}
    />
  );
}
