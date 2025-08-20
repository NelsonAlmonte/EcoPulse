export interface List<T> {
	data: T;
	pagination: Pagination;
}

interface Pagination {
	page: number;
	amount: number;
	total: number;
}
