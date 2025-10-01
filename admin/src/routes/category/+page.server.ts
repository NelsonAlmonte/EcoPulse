import { PUBLIC_API_URL } from '$env/static/public';
import type { Category } from '$lib/models/category.model';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const apiUrl = new URL('category', PUBLIC_API_URL);
	const response = await fetch(apiUrl);
	const categories: Category[] = await response.json();
	console.log(categories);
	return { categories };
};
