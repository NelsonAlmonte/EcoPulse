import { PUBLIC_API_URL } from '$env/static/public';
import type { PageServerLoad } from './$types';
import type { Issue } from '$lib/models/issue.model';
import type { List } from '$lib/models/response.model';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const apiUrl = new URL('issue/in-bound', PUBLIC_API_URL);
	const pagination = {
		page: url.searchParams.get('page') ?? '1',
		amount: url.searchParams.get('amount') ?? '6'
	};

	apiUrl.searchParams.set('page', pagination.page);
	apiUrl.searchParams.set('amount', pagination.amount);
	apiUrl.searchParams.set('north', url.searchParams.get('north') ?? '0');
	apiUrl.searchParams.set('south', url.searchParams.get('south') ?? '0');
	apiUrl.searchParams.set('east', url.searchParams.get('east') ?? '0');
	apiUrl.searchParams.set('west', url.searchParams.get('west') ?? '0');
	apiUrl.searchParams.set('status', url.searchParams.get('status') ?? '');
	apiUrl.searchParams.set('start_date', url.searchParams.get('start_date') ?? '');
	apiUrl.searchParams.set('end_date', url.searchParams.get('end_date') ?? '');
	apiUrl.searchParams.set('categories', url.searchParams.get('categories') ?? '');
	apiUrl.searchParams.set('order', url.searchParams.get('order') ?? '');
	apiUrl.searchParams.set('all', url.searchParams.get('all') ?? '');

	const mapParams = {
		lat: url.searchParams.get('lat') ?? '',
		lng: url.searchParams.get('lng') ?? '',
		zoom: url.searchParams.get('zoom') ?? ''
	};

	apiUrl.searchParams.set('lat', mapParams.lat);
	apiUrl.searchParams.set('lng', mapParams.lng);
	apiUrl.searchParams.set('zoom', mapParams.zoom);

	const response = await fetch(apiUrl);
	const issues = (await response.json()) as List<Issue[]>;

	return { issues, pagination, mapParams };
};
