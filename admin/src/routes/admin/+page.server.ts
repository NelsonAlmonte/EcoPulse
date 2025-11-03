import { PUBLIC_API_URL } from '$env/static/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const apiUrls = [
		new URL('issue/count', PUBLIC_API_URL),
		new URL('issue/count?status=PENDIENTE', PUBLIC_API_URL),
		new URL('issue/count?status=RESUELTO', PUBLIC_API_URL),
		new URL('user/count?isActive=true', PUBLIC_API_URL)
	];

	const [issuesCount, pendingIssuesCount, resolvedIssuesCount, activeUsersCount] =
		await Promise.all(apiUrls.map((url) => fetch(url)));

	return {
		issuesCount: await issuesCount.json(),
		pendingIssuesCount: await pendingIssuesCount.json(),
		resolvedIssuesCount: await resolvedIssuesCount.json(),
		activeUsersCount: await activeUsersCount.json()
	};
};
