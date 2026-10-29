export function readEnv(name: string) {
  return process.env[name]?.trim() || undefined;
}

export function requireEnv(name: string) {
  const value = readEnv(name);
  if (!value) {
    throw new Error(`Missing ${name}. Set it in .env.e2e (see .env.e2e.example).`);
  }

  return value;
}
