export interface ApiResult<T> {
  status: 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';
  data: T | null;
  error: Error | null;
}
