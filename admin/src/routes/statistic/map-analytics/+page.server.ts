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
		value.searchParams.set('north', url.searchParams.get('north') ?? '0');
		value.searchParams.set('south', url.searchParams.get('south') ?? '0');
		value.searchParams.set('east', url.searchParams.get('east') ?? '0');
		value.searchParams.set('west', url.searchParams.get('west') ?? '0');
		value.searchParams.set('status', url.searchParams.get('status') ?? '');
		value.searchParams.set('defined_date', url.searchParams.get('defined_date') ?? '');
		value.searchParams.set('start_date', url.searchParams.get('start_date') ?? '');
		value.searchParams.set('end_date', url.searchParams.get('end_date') ?? '');
		value.searchParams.set('categories', url.searchParams.get('categories') ?? '');
		value.searchParams.set('all', url.searchParams.get('all') ?? '');
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
