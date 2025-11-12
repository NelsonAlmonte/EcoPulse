import { ApiPayload } from '@core/interfaces/api.interface';

export function isList<T>(
  result: ApiPayload<T> | T | T[] | null
): result is T[] {
  return Array.isArray(result);
}

export function isPaginated<T>(
  result: ApiPayload<T> | T | T[] | null
): result is ApiPayload<T> {
  return result !== null && typeof result === 'object' && 'data' in result;
}

export function isSingle<T>(
  result: ApiPayload<T> | T | T[] | null
): result is T {
  return result !== null && !Array.isArray(result) && !isPaginated(result);
}
