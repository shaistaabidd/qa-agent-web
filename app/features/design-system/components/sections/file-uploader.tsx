import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import {
  FILE_UPLOADER_STATES,
  FileUploader,
  type FileUploadHandler,
} from '@/shared/ui/file-uploader';

const SAMPLE_NAME = 'annual_financial_report_2026.pdf';
const SAMPLE_SIZE = 6.3 * 1024 * 1024;

const simulateUpload: FileUploadHandler = (file, { onProgress, signal }) =>
  new Promise((resolve, reject) => {
    let loaded = 0;
    const timer = window.setInterval(() => {
      loaded = Math.min(file.size, loaded + file.size / 10);
      onProgress(loaded, file.size);
      if (loaded >= file.size) {
        window.clearInterval(timer);
        resolve();
      }
    }, 120);

    signal.addEventListener('abort', () => {
      window.clearInterval(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

export function FileUploaderSection() {
  return (
    <ComponentSection
      description="A drop area that turns into a file row while uploading, then after the upload finishes."
      id="file-uploader"
      title="File Uploader"
    >
      <Example
        contentClassName="w-full max-w-[456px] flex-col items-stretch"
        description="Drop or browse a file. Progress runs, then download and remove are available."
        title="Interactive"
      >
        <FileUploader onUpload={simulateUpload} />
      </Example>

      <Example
        contentClassName="w-full max-w-[456px] flex-col items-stretch"
        description="Default, drag over, uploading, and completed."
        title="Types"
      >
        {FILE_UPLOADER_STATES.map((state) => (
          <FileUploader
            fileName={state === 'uploading' || state === 'completed' ? SAMPLE_NAME : undefined}
            fileSize={state === 'completed' ? SAMPLE_SIZE : undefined}
            key={state}
            progress={state === 'uploading' ? 98 : undefined}
            state={state}
          />
        ))}
      </Example>
    </ComponentSection>
  );
}
