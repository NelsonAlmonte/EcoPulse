import { API_URL } from '$env/static/private';
import type { Issue } from '$lib/models/issue.model';
import type { List } from '$lib/models/response.model';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const apiUrl = new URL('issue/list', API_URL);
	const currentPage = url.searchParams.get('page') ?? '1';

	apiUrl.searchParams.set('page', currentPage);
	apiUrl.searchParams.set('amount', url.searchParams.get('amount') ?? '5');

	const response = await fetch(apiUrl);
	const issues = (await response.json()) as List<Issue[]>;

	return { issues, currentPage };
};
