import { apiBaseUrl } from './apiUrl';

export function toPhotoUrl(imageUrl?: string | null) {
  if (!imageUrl) {
    return '';
  }

  if (/^https?:\/\//.test(imageUrl)) {
    return imageUrl;
  }

  return `${apiBaseUrl()}${imageUrl}`;
}
