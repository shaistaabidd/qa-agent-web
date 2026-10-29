import type { HTMLAttributes, ReactNode } from 'react';

export const FILE_UPLOADER_STATES = ['default', 'drag-over', 'uploading', 'completed'] as const;

export type FileUploaderState = (typeof FILE_UPLOADER_STATES)[number];

export type FileUploadHandler = (
  file: File,
  handlers: {
    onProgress: (loaded: number, total: number) => void;
    signal: AbortSignal;
  },
) => Promise<void>;

export interface FileUploaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  accept?: string;
  browseLabel?: string;
  disabled?: boolean;
  fileName?: ReactNode;
  fileSize?: number;
  helperText?: ReactNode;
  maxSizeBytes?: number;
  name?: string;
  onCancel?: () => void;
  onDownload?: () => void;
  onFileChange?: (file: File | null) => void;
  onRemove?: () => void;
  onUpload?: FileUploadHandler;
  progress?: number;
  state?: FileUploaderState;
  title?: ReactNode;
  uploadUrl?: string;
}
