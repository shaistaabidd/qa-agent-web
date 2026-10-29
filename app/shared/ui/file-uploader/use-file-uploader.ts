import { type ChangeEvent, type DragEvent, useCallback, useEffect, useRef, useState } from 'react';

import { DEFAULT_ACCEPT, DEFAULT_MAX_SIZE_BYTES, DEFAULT_UPLOAD_URL } from './constants';
import type { FileUploaderState, FileUploadHandler } from './types';
import { UploadFailedError, uploadFile } from './upload-file';
import {
  BLOCKED_FILE_ERROR,
  CORRUPT_IMAGE_ERROR,
  formatAcceptError,
  formatMaxSizeError,
  hasExecutableSignature,
  isUnreadableImage,
  MULTIPLE_FILES_ERROR,
  validateFile,
} from './validate-file';

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError';
}

function fileFromTransfer(transfer: DataTransfer) {
  const fromList = transfer.files?.[0];
  if (fromList) {
    return fromList;
  }

  const item = transfer.items?.[0];
  if (item?.kind === 'file') {
    return item.getAsFile() ?? undefined;
  }

  return undefined;
}

export function useFileUploader({
  accept = DEFAULT_ACCEPT,
  disabled = false,
  maxSizeBytes = DEFAULT_MAX_SIZE_BYTES,
  onFileChange,
  onUpload,
  uploadUrl = DEFAULT_UPLOAD_URL,
}: {
  accept?: string;
  disabled?: boolean;
  maxSizeBytes?: number;
  onFileChange?: (file: File | null) => void;
  onUpload?: FileUploadHandler;
  uploadUrl?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCount = useRef(0);
  const requestId = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'uploading' | 'completed'>('idle');

  const state: FileUploaderState =
    phase === 'uploading'
      ? 'uploading'
      : phase === 'completed'
        ? 'completed'
        : dragging
          ? 'drag-over'
          : 'default';

  const stopUpload = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const showError = useCallback((message: string) => {
    setError(message);
  }, []);

  const clear = useCallback(() => {
    requestId.current += 1;
    stopUpload();
    setFile(null);
    setProgress(0);
    setPhase('idle');
    setError(null);
    onFileChange?.(null);
  }, [onFileChange, stopUpload]);

  const takeFile = useCallback(
    (next?: File) => {
      if (disabled || next == null) {
        return;
      }

      const message = validateFile(next, accept, maxSizeBytes);
      if (message) {
        showError(message);
        return;
      }

      const id = ++requestId.current;
      stopUpload();

      void (async () => {
        if (await hasExecutableSignature(next)) {
          if (id !== requestId.current) {
            return;
          }

          showError(BLOCKED_FILE_ERROR);
          return;
        }

        if (await isUnreadableImage(next)) {
          if (id !== requestId.current) {
            return;
          }

          showError(CORRUPT_IMAGE_ERROR);
          return;
        }

        if (id !== requestId.current) {
          return;
        }

        const controller = new AbortController();
        abortRef.current = controller;
        setDragging(false);
        dragCount.current = 0;
        setError(null);
        setFile(next);
        setProgress(0);
        setPhase('uploading');
        onFileChange?.(next);

        const reportProgress = (loaded: number, total: number) => {
          if (id !== requestId.current) {
            return;
          }

          const percent = total > 0 ? (loaded / total) * 100 : 0;
          setProgress(Math.min(99, percent));
        };

        try {
          if (onUpload) {
            await onUpload(next, {
              onProgress: reportProgress,
              signal: controller.signal,
            });
          } else {
            await uploadFile(next, uploadUrl, reportProgress, controller.signal);
          }

          if (id !== requestId.current) {
            return;
          }

          setProgress(100);
          setPhase('completed');
        } catch (caught) {
          if (id !== requestId.current || isAbortError(caught)) {
            return;
          }

          const status = caught instanceof UploadFailedError ? caught.status : 0;
          setFile(null);
          setProgress(0);
          setPhase('idle');
          showError(
            status === 413 ? formatMaxSizeError(maxSizeBytes) : 'Upload failed. Please try again.',
          );
          onFileChange?.(null);
        }
      })();
    },
    [accept, disabled, maxSizeBytes, onFileChange, onUpload, showError, stopUpload, uploadUrl],
  );

  useEffect(
    () => () => {
      requestId.current += 1;
      abortRef.current?.abort();
    },
    [],
  );

  function onDragEnter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (disabled || phase !== 'idle') {
      return;
    }

    dragCount.current += 1;
    setDragging(true);
  }

  function onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  function onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    dragCount.current -= 1;
    if (dragCount.current <= 0) {
      dragCount.current = 0;
      setDragging(false);
    }
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    dragCount.current = 0;
    setDragging(false);

    if (event.dataTransfer.files.length > 1) {
      showError(MULTIPLE_FILES_ERROR);
      return;
    }

    const next = fileFromTransfer(event.dataTransfer);
    if (!next) {
      showError(formatAcceptError(accept));
      return;
    }

    takeFile(next);
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    const next = files?.[0];
    const multiple = (files?.length ?? 0) > 1;
    event.target.value = '';
    if (multiple) {
      showError(MULTIPLE_FILES_ERROR);
      return;
    }

    if (next) {
      takeFile(next);
    }
  }

  return {
    clear,
    error,
    file,
    inputRef,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onInputChange,
    progress,
    state,
  };
}
