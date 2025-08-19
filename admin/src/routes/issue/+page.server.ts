import { API_URL } from '$env/static/private';
import type { Issue } from '$lib/models/issue.model';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(`${API_URL}issue`);
	const issues = (await response.json()) as Issue[];

	return { issues };
};
