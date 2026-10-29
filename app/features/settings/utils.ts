import { formatPhoneNumberIntl } from 'react-phone-number-input';

export function formatFullName(firstName: string, lastName: string) {
  return [firstName, lastName].filter(Boolean).join(' ');
}

export function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** "+1 201 555 0123" for display; the raw value when it can't be formatted, "Not set" when empty. */
export function formatPhone(phone: string) {
  return phone ? formatPhoneNumberIntl(phone) || phone : 'Not set';
}
