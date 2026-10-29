import { cn } from '@/shared/lib/utils';

import {
  fileClass,
  idleClass,
  idleDisabledClass,
  idleIconClass,
  idleIconStateClass,
  idleStateClass,
} from './constants';
import type { FileUploaderState } from './types';

export function isIdleState(state: FileUploaderState): state is 'default' | 'drag-over' {
  return state === 'default' || state === 'drag-over';
}

export function getIdleClassName(
  state: 'default' | 'drag-over',
  disabled?: boolean,
  className?: string,
) {
  return cn(idleClass, idleStateClass[state], disabled && idleDisabledClass, className);
}

export function getIdleIconClassName(state: 'default' | 'drag-over') {
  return cn(idleIconClass, idleIconStateClass[state]);
}

export function getFileClassName(className?: string) {
  return cn(fileClass, className);
}

export function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return '0 B';
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    const kb = bytes / 1024;
    return `${kb >= 10 ? Math.round(kb) : kb.toFixed(1)} KB`;
  }

  const mb = bytes / (1024 * 1024);
  return `${mb >= 10 ? Math.round(mb) : mb.toFixed(1)} MB`;
}

export function downloadFile(file: File) {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Some browsers start the download after click returns, so revoke on a later task.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
