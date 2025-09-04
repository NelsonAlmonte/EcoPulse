<script lang="ts">
	import { goto } from '$app/navigation';
	import { issueList } from '$lib/store/issue.svelte';
	import { Heading, PaginationNav } from 'flowbite-svelte';
	import IssueItem from './IssueItem.svelte';

	let currentPage = $derived(issueList.list.pagination.page);
	let currentAmount = $derived(issueList.list.pagination.amount);
	let totalPages = $derived(
		Math.ceil(issueList.list.pagination.total / issueList.list.pagination.amount)
	);

	function handlePageChange(page: number) {
		currentPage = page;

		const newUrl = new URL(window.location.href);

		newUrl.searchParams.set('page', currentPage.toString());
		newUrl.searchParams.set('amount', issueList.list.pagination.amount.toString() ?? '5');

		goto(newUrl, { noScroll: true });
	}
</script>

<Heading class="mb-4" tag="h6">{issueList.list.pagination.total} incidencias</Heading>
<div class="grid grid-cols-2 gap-4">
	{#each issueList.list.data as issue (issue.id)}
		<IssueItem {issue} />
	{/each}
</div>

<div class="mt-4 flex items-center justify-center">
	<PaginationNav {currentPage} {totalPages} onPageChange={handlePageChange} size="large" />
</div>
