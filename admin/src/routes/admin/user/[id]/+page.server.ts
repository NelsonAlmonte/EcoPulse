import { PUBLIC_API_URL } from '$env/static/public';
import type { List } from '$lib/models/response.model';
import type { User } from '$lib/models/user.model';
import type { Issue } from '$lib/models/issue.model';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch, url }) => {
	let apiUrls = [
		new URL(`user/${params.id}`, PUBLIC_API_URL),
		new URL(`user/${params.id}/issues`, PUBLIC_API_URL)
	];

	apiUrls = apiUrls.map((value) => {
		value.searchParams.set('page', url.searchParams.get('page') ?? '1');
		value.searchParams.set('amount', url.searchParams.get('amount') ?? '6');
		value.searchParams.set('status', url.searchParams.get('status') ?? '');
		value.searchParams.set('defined_date', url.searchParams.get('defined_date') ?? '');
		value.searchParams.set('start_date', url.searchParams.get('start_date') ?? '');
		value.searchParams.set('end_date', url.searchParams.get('end_date') ?? '');
		value.searchParams.set('categories', url.searchParams.get('categories') ?? '');
		value.searchParams.set('order', url.searchParams.get('order') ?? '');
		value.searchParams.set('all', url.searchParams.get('all') ?? '');
		return value;
	});

	const [userResponse, issuesResponse] = await Promise.all(apiUrls.map((url) => fetch(url)));

	return {
		user: (await userResponse.json()) as User,
		issues: (await issuesResponse.json()) as List<Issue[]>
	};
};
