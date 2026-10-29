import { useState } from 'react';

import { FileUploader } from '@/shared/ui/file-uploader';
import { Label } from '@/shared/ui/label';

import { RESOURCE_FILE_ACCEPT, RESOURCE_FILE_MAX_BYTES } from '../constants';
import type { ResourceFormApi } from '../hooks/useResourceForm';
import { fileNameFromUrl } from '../utils';

type ResourceDocumentFieldProps = {
  existingUrl?: string | null;
  form: ResourceFormApi;
};

// The file is sent with the form, so there is nothing to upload when it is picked.
async function skipUpload() {}

export function ResourceDocumentField({ existingUrl, form }: ResourceDocumentFieldProps) {
  const [existingRemoved, setExistingRemoved] = useState(false);
  const showExisting = Boolean(existingUrl) && !existingRemoved;

  return (
    <form.Field name="file">
      {(field) => (
        <div className="flex flex-col gap-[8px]">
          <Label bold optional>
            Document
          </Label>
          <FileUploader
            accept={RESOURCE_FILE_ACCEPT}
            helperText="Supported formats: PDF, DOC, DOCX (Max 100MB)"
            maxSizeBytes={RESOURCE_FILE_MAX_BYTES}
            onFileChange={field.handleChange}
            onUpload={skipUpload}
            title="Drag & drop a document here"
            {...(showExisting && existingUrl
              ? {
                  fileName: fileNameFromUrl(existingUrl),
                  onDownload: () => window.open(existingUrl, '_blank', 'noopener'),
                  onRemove: () => setExistingRemoved(true),
                  state: 'completed' as const,
                }
              : {})}
          />
        </div>
      )}
    </form.Field>
  );
}
