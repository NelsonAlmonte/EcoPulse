import { PUBLIC_API_URL } from '$env/static/public';
import type { Statistic } from '$lib/models/statistic.model';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const statistics = await getStatistics(fetch);

	// apiUrl.searchParams.set('status', url.searchParams.get('status') ?? '');

	return { statistics };
};

async function getStatistics(fetch: typeof globalThis.fetch): Promise<Statistic> {
	const [statusRes, categoryRes] = await Promise.all([
		fetch(new URL('statistic/status', PUBLIC_API_URL)),
		fetch(new URL('statistic/category', PUBLIC_API_URL))
	]);

	return {
		status: await statusRes.json(),
		category: await categoryRes.json()
	};
}
