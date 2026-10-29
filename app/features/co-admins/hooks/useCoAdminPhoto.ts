import { useEffect, useRef, useState } from 'react';

import type { CoAdminPhotoChange } from '../types';

/** Tracks a photo choice for the edit drawer: keep, replace with a file, or remove. */
export function useCoAdminPhoto(currentUrl: string) {
  const [change, setChange] = useState<CoAdminPhotoChange>(undefined);
  const [preview, setPreview] = useState<string | null>(null);
  const objectUrl = useRef<string | null>(null);

  function releaseObjectUrl() {
    if (objectUrl.current) {
      URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = null;
    }
  }

  useEffect(() => releaseObjectUrl, []);

  function pick(file: File) {
    releaseObjectUrl();
    objectUrl.current = URL.createObjectURL(file);
    setPreview(objectUrl.current);
    setChange(file);
  }

  function remove() {
    releaseObjectUrl();
    setPreview('');
    setChange(null);
  }

  return {
    change,
    pick,
    remove,
    value: preview ?? currentUrl,
  };
}
