import { PUBLIC_API_URL } from '$env/static/public';
import type { User } from '$lib/models/user.model';
import type { Issue } from '$lib/models/issue.model';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const apiUrls = [
		new URL(`user/${params.id}`, PUBLIC_API_URL),
		new URL(`user/${params.id}/issues`, PUBLIC_API_URL)
	];

	const [userResponse, issuesResponse] = await Promise.all(apiUrls.map((url) => fetch(url)));

	return {
		user: (await userResponse.json()) as User,
		issues: (await issuesResponse.json()) as Issue[]
	};
};
