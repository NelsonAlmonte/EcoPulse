import { PUBLIC_API_URL } from '$env/static/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const apiUrls = {
		insights: [
			new URL('issue/count', PUBLIC_API_URL),
			new URL('issue/count?status=PENDIENTE', PUBLIC_API_URL),
			new URL('issue/count?status=RESUELTO', PUBLIC_API_URL),
			new URL('user/count?isActive=true', PUBLIC_API_URL)
		],
		statistics: [
			new URL('statistic/category', PUBLIC_API_URL),
			new URL('statistic/date', PUBLIC_API_URL)
		]
	};

	apiUrls.statistics = apiUrls.statistics.map((value) => {
		value.searchParams.set('status', url.searchParams.get('status') ?? '');
		value.searchParams.set('defined_date', url.searchParams.get('defined_date') ?? '');
		value.searchParams.set('start_date', url.searchParams.get('start_date') ?? '');
		value.searchParams.set('end_date', url.searchParams.get('end_date') ?? '');
		value.searchParams.set('categories', url.searchParams.get('categories') ?? '');
		value.searchParams.set('all', url.searchParams.get('all') ?? '');
		return value;
	});

	const [issuesCount, pendingIssuesCount, resolvedIssuesCount, activeUsersCount] =
		await Promise.all(apiUrls.insights.map((url) => fetch(url)));
	const [categoryStatistic, dateStatistic] = await Promise.all(
		apiUrls.statistics.map((url) => fetch(url))
	);

	return {
		issuesCount: await issuesCount.json(),
		pendingIssuesCount: await pendingIssuesCount.json(),
		resolvedIssuesCount: await resolvedIssuesCount.json(),
		activeUsersCount: await activeUsersCount.json(),
		categoryStatistic: await categoryStatistic.json(),
		dateStatistic: await dateStatistic.json()
	};
};
