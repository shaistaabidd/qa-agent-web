import type { z } from 'zod';

export function schemaMessage(schema: z.ZodType, value: string): string | undefined {
  const result = schema.safeParse(value);
  if (result.success) return undefined;
  return result.error.issues[0]?.message;
}

export function firstError(errors: unknown[]) {
  for (const error of errors) {
    if (typeof error === 'string' && error) {
      return error;
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string' &&
      error.message
    ) {
      return error.message;
    }
  }
}

export function revalidateIfError({
  fieldApi,
}: {
  fieldApi: {
    state: { meta: { errors: unknown[] } };
    validate: (cause: 'blur') => unknown;
  };
}) {
  if (fieldApi.state.meta.errors.length > 0) {
    void fieldApi.validate('blur');
  }
}
