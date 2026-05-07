/** Matches RN Firebase / gRPC transient Firestore errors worth retrying. */
const RETRYABLE = /deadline-exceeded|unavailable|resource-exhausted|network/i;

function isRetryable(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return RETRYABLE.test(msg);
}

export async function withFirestoreRetry<T>(
  fn: () => Promise<T>,
  opts?: {attempts?: number; baseDelayMs?: number},
): Promise<T> {
  const attempts = Math.max(1, opts?.attempts ?? 4);
  const baseDelayMs = opts?.baseDelayMs ?? 400;
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (!isRetryable(e) || i === attempts - 1) {
        throw e;
      }
      await new Promise<void>(resolve =>
        setTimeout(resolve, baseDelayMs * (i + 1)),
      );
    }
  }
  throw lastErr;
}
