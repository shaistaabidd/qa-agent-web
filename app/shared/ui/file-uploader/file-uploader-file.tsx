import { DownloadSimpleIcon } from '@phosphor-icons/react/DownloadSimple';
import { FileTextIcon } from '@phosphor-icons/react/FileText';
import { TrashIcon } from '@phosphor-icons/react/Trash';
import { XIcon } from '@phosphor-icons/react/X';
import type { HTMLAttributes, ReactNode } from 'react';

import { Button } from '@/shared/ui/button';
import { Progress } from '@/shared/ui/progress';
import { Typography } from '@/shared/ui/Typography';

import { fileActionsClass, fileContentClass, fileIconClass } from './constants';
import type { FileUploaderState } from './types';
import { formatFileSize, getFileClassName } from './utils';

export function FileUploaderFile({
  className,
  fileName,
  fileSize,
  onCancel,
  onDownload,
  onRemove,
  progress = 0,
  state,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  fileName?: ReactNode;
  fileSize?: number;
  onCancel?: () => void;
  onDownload?: () => void;
  onRemove?: () => void;
  progress?: number;
  state: Extract<FileUploaderState, 'uploading' | 'completed'>;
}) {
  const percent = Math.round(progress);
  const isUploading = state === 'uploading';

  return (
    <div
      className={getFileClassName(className)}
      data-slot="file-uploader"
      data-state={state}
      {...props}
    >
      <span className={fileIconClass} data-slot="file-uploader-icon">
        <FileTextIcon aria-hidden weight="regular" />
      </span>
      <div className={fileContentClass} data-slot="file-uploader-content">
        <Typography
          as="p"
          className="w-full truncate text-fg-default"
          fontWeight="medium"
          size="sm"
        >
          {fileName}
        </Typography>
        {isUploading ? (
          <Progress
            aria-label={`Uploading ${String(fileName ?? 'file')}`}
            value={percent}
            valueLabel={`${percent}%`}
          />
        ) : fileSize != null ? (
          <Typography as="p" className="text-fg-secondary" size="xs">
            {formatFileSize(fileSize)}
          </Typography>
        ) : null}
      </div>
      {isUploading ? (
        <Button aria-label="Cancel upload" onClick={onCancel} size="icon-sm" variant="ghost">
          <XIcon aria-hidden weight="light" />
        </Button>
      ) : (
        <div className={fileActionsClass}>
          <Button aria-label="Download file" onClick={onDownload} size="icon-sm" variant="ghost">
            <DownloadSimpleIcon aria-hidden weight="light" />
          </Button>
          <Button
            aria-label="Remove file"
            className="text-fg-danger hover:text-fg-danger"
            onClick={onRemove}
            size="icon-sm"
            variant="ghost"
          >
            <TrashIcon aria-hidden weight="light" />
          </Button>
        </div>
      )}
    </div>
  );
}
