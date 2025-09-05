import { PUBLIC_API_URL } from '$env/static/public';
import type { PageServerLoad } from './$types';
import type { Issue } from '$lib/models/issue.model';
import type { List } from '$lib/models/response.model';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const apiUrl = new URL('issue/in-bound', PUBLIC_API_URL);
	const pagination = {
		page: url.searchParams.get('page') ?? '1',
		amount: url.searchParams.get('amount') ?? '6'
	};

	apiUrl.searchParams.set('page', pagination.page);
	apiUrl.searchParams.set('amount', pagination.amount);
	apiUrl.searchParams.set('north', url.searchParams.get('north') ?? '0');
	apiUrl.searchParams.set('south', url.searchParams.get('south') ?? '0');
	apiUrl.searchParams.set('east', url.searchParams.get('east') ?? '0');
	apiUrl.searchParams.set('west', url.searchParams.get('west') ?? '0');

	const response = await fetch(apiUrl);
	const issues = (await response.json()) as List<Issue[]>;

	return { issues, pagination };
};
