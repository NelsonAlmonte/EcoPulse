export interface ApiResult<T> {
  status: 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';
  data: ApiPayload<T>;
  error: Error | null;
}

export interface ApiPayload<T> {
  items: T | null;
  pagination?: Pagination;
}

interface Pagination {
  page: number;
  amount: number;
  total: number;
}
