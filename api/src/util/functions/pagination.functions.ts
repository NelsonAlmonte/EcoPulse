import { PaginationParams } from 'src/util/interfaces/response.params';

export function buildPaginationParams(
  page: number,
  amount: number,
): PaginationParams {
  return {
    skip: page !== 1 ? (Number(page) - 1) * Number(amount) : 0,
    take: Number(amount),
  };
}
