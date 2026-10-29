/** Date helpers shared by features (list filters and detail views). */

/** A local calendar day as YYYY-MM-DD, the format date filters send; '' when empty. */
export function toIsoDate(value: Date | undefined) {
  if (!value) {
    return '';
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/** Reads a YYYY-MM-DD day back as a local Date; undefined when empty or invalid. */
export function parseIsoDate(value: string) {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
}

/** True for a real calendar day written as YYYY-MM-DD ('2026-02-31' is not one). */
export function isIsoDate(value: string) {
  return toIsoDate(parseIsoDate(value)) === value;
}

/** A timestamp in the viewer's locale, or 'N/A' when missing or invalid. */
export function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return 'N/A';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }

  return date.toLocaleString();
}
