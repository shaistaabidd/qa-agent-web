import { formatFileSize } from './utils';

const EXTENSION_LABELS: Record<string, string> = {
  doc: 'DOC',
  docx: 'DOCX',
  gif: 'GIF',
  jpeg: 'JPG',
  jpg: 'JPG',
  pdf: 'PDF',
  png: 'PNG',
};

const MIME_BY_EXTENSION: Record<string, readonly string[]> = {
  doc: ['application/msword'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  gif: ['image/gif'],
  jpeg: ['image/jpeg', 'image/jpg', 'image/pjpeg'],
  jpg: ['image/jpeg', 'image/jpg', 'image/pjpeg'],
  pdf: ['application/pdf', 'application/x-pdf'],
  png: ['image/png', 'image/x-png'],
};

const BLOCKED_EXTENSIONS = new Set(['bat', 'cmd', 'com', 'cpl', 'dll', 'exe', 'msi', 'pif', 'scr']);

const BLOCKED_MIME_TYPES = new Set([
  'application/vnd.microsoft.portable-executable',
  'application/x-dosexec',
  'application/x-executable',
  'application/x-ms-dos-executable',
  'application/x-msdos-program',
  'application/x-msdownload',
  'application/x-msi',
]);

const EXECUTABLE_SIGNATURES: readonly (readonly number[])[] = [
  [0x4d, 0x5a],
  [0x7f, 0x45, 0x4c, 0x46],
];

export const BLOCKED_FILE_ERROR = 'Executable files cannot be uploaded.';

export const CORRUPT_IMAGE_ERROR = 'This image is corrupt or cannot be read.';

export const MULTIPLE_FILES_ERROR = 'Only one file at a time.';

export function validateFile(file: File, accept: string, maxSizeBytes: number) {
  if (file.size === 0) {
    return 'This file is empty.';
  }

  if (isBlockedFile(file)) {
    return BLOCKED_FILE_ERROR;
  }

  if (file.size > maxSizeBytes) {
    return formatMaxSizeError(maxSizeBytes);
  }

  if (!isAcceptedFile(file, accept)) {
    return formatAcceptError(accept);
  }

  return null;
}

export function isBlockedFile(file: File) {
  const type = file.type.trim().toLowerCase();
  return (
    BLOCKED_EXTENSIONS.has(fileExtension(file.name)) ||
    (type !== '' && BLOCKED_MIME_TYPES.has(type))
  );
}

export function isAcceptedFile(file: File, accept: string) {
  const extension = fileExtension(file.name);
  const type = file.type.trim().toLowerCase();

  if (isBlockedFile(file)) {
    return false;
  }

  const tokens = acceptTokens(accept);
  if (tokens.length === 0) {
    return true;
  }

  return tokens.some((token) => matchesToken(token, extension, type));
}

export function formatAcceptError(accept: string) {
  const labels = [...new Set(acceptTokens(accept).map((token) => acceptTokenLabel(token)))];

  if (labels.length === 0) {
    return 'Please upload a supported file.';
  }

  if (labels.length === 1) {
    return `Please upload a ${labels[0]} file.`;
  }

  const last = labels[labels.length - 1];
  return `Please upload a ${labels.slice(0, -1).join(', ')}, or ${last} file.`;
}

export function formatMaxSizeError(maxSizeBytes: number) {
  return `Please upload a file of ${formatSizeLimit(maxSizeBytes)} or less.`;
}

export async function hasExecutableSignature(file: File) {
  try {
    const header = new Uint8Array(await file.slice(0, 4).arrayBuffer());
    return EXECUTABLE_SIGNATURES.some((signature) =>
      signature.every((byte, index) => header[index] === byte),
    );
  } catch {
    return true;
  }
}

export function isUnreadableImage(file: File) {
  if (!file.type.toLowerCase().startsWith('image/')) {
    return Promise.resolve(false);
  }

  const url = URL.createObjectURL(file);

  return new Promise<boolean>((resolve) => {
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image.naturalWidth === 0);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(true);
    };
    image.src = url;
  });
}

function matchesToken(token: string, extension: string, type: string) {
  if (token.startsWith('.')) {
    if (extension !== token.slice(1)) {
      return false;
    }

    return mimeMatchesExtension(extension, type);
  }

  if (token.endsWith('/*')) {
    return type.startsWith(token.slice(0, -1));
  }

  if (type) {
    return type === token;
  }

  const allowed = MIME_BY_EXTENSION[extension];
  return allowed?.includes(token) ?? false;
}

function mimeMatchesExtension(extension: string, type: string) {
  if (!type || type === 'application/octet-stream') {
    return true;
  }

  const allowed = MIME_BY_EXTENSION[extension];
  if (!allowed) {
    return false;
  }

  return allowed.includes(type);
}

function fileExtension(name: string) {
  const base = name.trim().split(/[/\\]/).pop() ?? '';
  const dot = base.lastIndexOf('.');
  return dot > 0 ? base.slice(dot + 1).toLowerCase() : '';
}

function acceptTokens(accept: string) {
  return accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
}

function acceptTokenLabel(token: string) {
  const bare = token.replace(/^\./, '').replace(/\/\*$/, '');
  const subtype = bare.split('/').pop() ?? bare;
  return EXTENSION_LABELS[subtype] ?? EXTENSION_LABELS[bare] ?? subtype.toUpperCase();
}

function formatSizeLimit(bytes: number) {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1 && Number.isInteger(mb)) {
    return `${mb}MB`;
  }

  const kb = bytes / 1024;
  if (kb >= 1 && Number.isInteger(kb)) {
    return `${kb}KB`;
  }

  return formatFileSize(bytes);
}
