export interface ApiResult<T> {
  status: 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';
  result: ApiPayload<T> | T;
  error: Error | null;
}

export interface ApiPayload<T> {
  data: T | null;
  pagination?: Pagination;
}

interface Pagination {
  page: number;
  amount: number;
  total: number;
}
