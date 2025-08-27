import { PUBLIC_API_URL } from '$env/static/public';
import type { Issue } from '$lib/models/issue.model';
import type { List } from '$lib/models/response.model';
import { SvelteURL } from 'svelte/reactivity';

class IssueList {
	#issueList = $state<List<Issue[]>>({
		data: [],
		pagination: {
			page: 1,
			amount: 5,
			total: 5
		}
	});

	get list() {
		return this.#issueList;
	}

	set list(value: List<Issue[]>) {
		this.#issueList = value;
	}

	async refresh(currentPage: string, amount?: string) {
		const apiUrl = new SvelteURL('issue/list', PUBLIC_API_URL);

		apiUrl.searchParams.set('page', currentPage);
		apiUrl.searchParams.set('amount', amount ?? '5');

		const response = await fetch(apiUrl);
		const issues = (await response.json()) as List<Issue[]>;

		this.#issueList = issues;
	}
}

export const issueList = new IssueList();
