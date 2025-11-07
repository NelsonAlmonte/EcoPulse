import { ApiPayload } from '@core/interfaces/api.interface';

export function isPaginated<T>(
  result: ApiPayload<T> | T | null
): result is ApiPayload<T> {
  return (
    result !== null &&
    typeof result === 'object' &&
    'data' in result &&
    Array.isArray((result as any).data)
  );
}
