import type { User } from '$lib/models/user.model';
import type { List } from '$lib/models/response.model';
import { page } from '$app/state';
import { PUBLIC_API_URL } from '$env/static/public';
import { SvelteURL } from 'svelte/reactivity';

class UserList {
	#userList = $state<List<User[]>>({
		data: [],
		pagination: {
			page: 1,
			amount: 5,
			total: 5
		}
	});
	session = $derived(page.data.session);

	get list() {
		return this.#userList;
	}

	set list(value: List<User[]>) {
		this.#userList = value;
	}

	async refresh(currentPage: string, amount?: string) {
		const apiUrl = new SvelteURL('user/list', PUBLIC_API_URL);

		apiUrl.searchParams.set('page', currentPage);
		apiUrl.searchParams.set('amount', amount ?? '5');

		const response = await fetch(apiUrl, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.session.access_token}`
			}
		});
		const users = (await response.json()) as List<User[]>;

		this.#userList = users;
	}
}

export const userList = new UserList();
