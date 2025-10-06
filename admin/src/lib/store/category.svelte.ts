import { PUBLIC_API_URL } from '$env/static/public';
import type { Category } from '$lib/models/category.model';
import type { List } from '$lib/models/response.model';
import { SvelteURL } from 'svelte/reactivity';

class CategoryList {
	#categoryList = $state<List<Category[]>>({
		data: [],
		pagination: {
			page: 1,
			amount: 5,
			total: 5
		}
	});

	get list() {
		return this.#categoryList;
	}

	set list(value: List<Category[]>) {
		this.#categoryList = value;
	}

	async refresh(currentPage: string, amount?: string) {
		const apiUrl = new SvelteURL('category/list', PUBLIC_API_URL);

		apiUrl.searchParams.set('page', currentPage);
		apiUrl.searchParams.set('amount', amount ?? '5');

		const response = await fetch(apiUrl);
		const categories = (await response.json()) as List<Category[]>;

		this.#categoryList = categories;
	}
}

export const categoryList = new CategoryList();
