import { existsSync } from 'node:fs';
import path from 'node:path';

import { requireEnv } from './env';

const AUTH_DIR = path.join(import.meta.dirname, '..', '.auth');

export const COADMIN_STATE = path.join(AUTH_DIR, 'co-admin.json');

export function hasAuthState(file: string) {
  return existsSync(file);
}

export function coAdminCredentials() {
  return {
    email: requireEnv('E2E_COADMIN_EMAIL'),
    password: requireEnv('E2E_COADMIN_PASSWORD'),
  };
}
