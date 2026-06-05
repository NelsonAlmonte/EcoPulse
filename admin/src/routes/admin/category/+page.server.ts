import { PUBLIC_API_URL } from '$env/static/public';
import type { Category } from '$lib/models/category.model';
import type { List } from '$lib/models/response.model';
import type { PageServerLoad } from './$types';
import { parseResponse } from '$lib/utils/parseResponse';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const apiUrl = new URL('category/list', PUBLIC_API_URL);
	const pagination = {
		page: url.searchParams.get('page') ?? '1',
		amount: url.searchParams.get('amount') ?? '5'
	};

	apiUrl.searchParams.set('page', pagination.page);
	apiUrl.searchParams.set('amount', pagination.amount);

	const response = await fetch(apiUrl);
	const categories = await parseResponse<List<Category[]>>(response);

	return { categories, pagination };
};
