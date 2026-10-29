import { emailSchema } from '@/shared/lib/schemas';

import { MAX_INVITE_EMAILS } from './constants';
import { parseEmails } from './utils';

/** Checks a list of emails typed into one field, separated by commas, spaces, or new lines. */
export function inviteEmailsSchema({ value }: { value: string }) {
  const emails = parseEmails(value);
  if (emails.length === 0) {
    return 'Please enter at least one email address';
  }

  if (emails.length > MAX_INVITE_EMAILS) {
    return `You can invite up to ${MAX_INVITE_EMAILS} people at a time`;
  }

  const invalid = emails.find((email) => !emailSchema.safeParse(email).success);
  if (invalid) {
    return `${invalid} is not a valid email address`;
  }

  const duplicate = emails.find((email, index) => emails.indexOf(email) !== index);
  if (duplicate) {
    return `${duplicate} is entered more than once`;
  }

  return undefined;
}
