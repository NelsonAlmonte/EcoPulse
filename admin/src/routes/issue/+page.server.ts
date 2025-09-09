import { PUBLIC_API_URL } from '$env/static/public';
import type { Issue } from '$lib/models/issue.model';
import type { List } from '$lib/models/response.model';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const apiUrl = new URL('issue/list', PUBLIC_API_URL);
	const pagination = {
		page: url.searchParams.get('page') ?? '1',
		amount: url.searchParams.get('amount') ?? '5'
	};

	apiUrl.searchParams.set('page', pagination.page);
	apiUrl.searchParams.set('amount', pagination.amount);
	apiUrl.searchParams.set('status', url.searchParams.get('status') ?? '');
	apiUrl.searchParams.set('start_date', url.searchParams.get('start_date') ?? '');
	apiUrl.searchParams.set('end_date', url.searchParams.get('end_date') ?? '');
	apiUrl.searchParams.set('categories', url.searchParams.get('categories') ?? '');
	apiUrl.searchParams.set('order', url.searchParams.get('order') ?? '');

	const response = await fetch(apiUrl);
	const issues = (await response.json()) as List<Issue[]>;

	return { issues, pagination };
};
