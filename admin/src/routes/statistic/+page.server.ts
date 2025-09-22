import { PUBLIC_API_URL } from '$env/static/public';
import type { Statistic } from '$lib/models/statistic.model';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const statistics = await getStatistics(fetch, url);

	return { statistics };
};

async function getStatistics(
	fetch: typeof globalThis.fetch,
	url: URL
): Promise<Record<string, Statistic[]>> {
	let apiUrls = [
		new URL('statistic/status', PUBLIC_API_URL),
		new URL('statistic/category', PUBLIC_API_URL),
		new URL('statistic/date', PUBLIC_API_URL)
	];

	apiUrls = apiUrls.map((value) => {
		value.searchParams.set('filter', url.searchParams.get('filter') ?? '');
		value.searchParams.set('start_date', url.searchParams.get('start_date') ?? '');
		value.searchParams.set('end_date', url.searchParams.get('end_date') ?? '');
		return value;
	});

	const [statusResponse, categoryResponse, dateResponse] = await Promise.all(
		apiUrls.map((url) => fetch(url))
	);

	return {
		status: await statusResponse.json(),
		category: await categoryResponse.json(),
		date: await dateResponse.json()
	};
}
