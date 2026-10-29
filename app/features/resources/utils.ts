import type { Resource, ResourceFormValues } from './types';

const VIDEO_URL_PATTERN =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)[\w-]+|youtu\.be\/[\w-]+|vimeo\.com\/\d+)/i;

export function isVideoUrl(value: string) {
  return VIDEO_URL_PATTERN.test(value.trim());
}

export function formatResourceDate(value: string | null | undefined) {
  if (!value) {
    return 'Unknown';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatResourceLabel(value: string | null | undefined) {
  if (!value) {
    return '';
  }

  return `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`;
}

export function fileNameFromUrl(url: string) {
  const path = url.split('?')[0] ?? url;
  return decodeURIComponent(path.split('/').pop() || 'document');
}

/** The backend returns lowercase enums but expects uppercase ones. */
export function toFormValues(resource: Resource): ResourceFormValues {
  return {
    category: resource.category.toUpperCase(),
    description: resource.description ?? '',
    file: null,
    resourceType: resource.resourceType.toUpperCase(),
    title: resource.title,
    videoLink: resource.videoLink ?? '',
  };
}
