/**
 * Simulates network latency for the mock data layer. Swap the resolvers in
 * each api/*.ts module for real `apiClient` (axios) calls once a backend
 * is available — the calling hooks won't need to change.
 */
export function simulateRequest<T>(data: T, delayMs = 500): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delayMs);
  });
}
