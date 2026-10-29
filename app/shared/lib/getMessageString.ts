function firstMessage(value: unknown): string | undefined {
  if (!Array.isArray(value)) return undefined;

  for (const item of value) {
    if (!item || typeof item !== 'object' || !('message' in item)) continue;
    const message = (item as { message: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message.trim();
  }

  return undefined;
}

export function getMessageString(data: unknown, fallback = 'Something went wrong'): string {
  if (data instanceof Error && data.message.trim()) {
    return data.message.trim();
  }

  if (typeof data === 'string' && data.trim()) {
    return data.trim();
  }

  if (data && typeof data === 'object' && 'response' in data) {
    const response = (data as { response?: { data?: unknown } }).response;
    if (response && typeof response === 'object' && 'data' in response) {
      const fromBody = getMessageString(response.data, '');
      if (fromBody) {
        return fromBody;
      }
    }
  }

  if (data && typeof data === 'object') {
    if ('error' in data) {
      const error = (data as { error: unknown }).error;
      if (typeof error === 'string' && error.trim()) {
        return error.trim();
      }
      if (Array.isArray(error)) {
        const first = error.find(
          (item): item is string => typeof item === 'string' && Boolean(item.trim()),
        );
        if (first) {
          return first.trim();
        }
      }
    }

    if ('message' in data) {
      const message = (data as { message: unknown }).message;
      if (typeof message === 'string' && message.trim()) {
        return message.trim();
      }
    }

    const fromGraphQL =
      firstMessage(
        'graphQLErrors' in data ? (data as { graphQLErrors: unknown }).graphQLErrors : undefined,
      ) ?? firstMessage('errors' in data ? (data as { errors: unknown }).errors : undefined);
    if (fromGraphQL) return fromGraphQL;
  }

  return fallback;
}
