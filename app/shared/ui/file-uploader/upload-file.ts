export class UploadFailedError extends Error {
  readonly status: number;

  constructor(status: number) {
    super('Upload failed');
    this.name = 'UploadFailedError';
    this.status = status;
  }
}

export function uploadFile(
  file: File,
  url: string,
  onProgress: (loaded: number, total: number) => void,
  signal: AbortSignal,
) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('The operation was aborted.', 'AbortError'));
      return;
    }

    const xhr = new XMLHttpRequest();
    const body = new FormData();
    body.append('file', file, file.name);

    const onAbort = () => {
      xhr.abort();
    };

    signal.addEventListener('abort', onAbort, { once: true });

    xhr.open('POST', url);
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }

      onProgress(event.loaded, event.total);
    };
    xhr.onload = () => {
      signal.removeEventListener('abort', onAbort);
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(file.size, file.size);
        resolve();
        return;
      }

      reject(new UploadFailedError(xhr.status));
    };
    xhr.onerror = () => {
      signal.removeEventListener('abort', onAbort);
      reject(new UploadFailedError(0));
    };
    xhr.onabort = () => {
      signal.removeEventListener('abort', onAbort);
      reject(new DOMException('The operation was aborted.', 'AbortError'));
    };
    xhr.send(body);
  });
}
