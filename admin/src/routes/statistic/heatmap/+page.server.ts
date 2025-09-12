import { PUBLIC_API_URL } from '$env/static/public';
import type { Issue } from '$lib/models/issue.model';
import type { List } from '$lib/models/response.model';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const apiUrl = new URL('issue/coords', PUBLIC_API_URL);

	apiUrl.searchParams.set('status', url.searchParams.get('status') ?? '');
	apiUrl.searchParams.set('start_date', url.searchParams.get('start_date') ?? '');
	apiUrl.searchParams.set('end_date', url.searchParams.get('end_date') ?? '');
	apiUrl.searchParams.set('categories', url.searchParams.get('categories') ?? '');

	const response = await fetch(apiUrl);
	const issues = (await response.json()) as List<Pick<Issue, 'latitude' | 'longitude'>[]>;
	console.log(issues.data);
	return { issues };
};
