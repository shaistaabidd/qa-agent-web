import { type AuthGraphQLUser } from '@/features/auth';
import { toPhotoUrl } from '@/shared/lib/photoUrl';

import type { AccountProfile } from './types';

export function mapUserToProfile(user: AuthGraphQLUser): AccountProfile {
  return {
    email: user.email,
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    phone: user.phone ?? '',
    pendingEmail: user.unconfirmedEmail || null,
    photoUrl: toPhotoUrl(user.imageUrl),
  };
}
