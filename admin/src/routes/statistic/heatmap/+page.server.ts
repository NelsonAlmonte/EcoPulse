import { PUBLIC_API_URL } from '$env/static/public';
import type { Issue } from '$lib/models/issue.model';
import type { List } from '$lib/models/response.model';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const apiUrl = new URL('issue', PUBLIC_API_URL);
	const response = await fetch(apiUrl);
	const issues = (await response.json()) as List<Issue[]>;

	return { issues };
};
