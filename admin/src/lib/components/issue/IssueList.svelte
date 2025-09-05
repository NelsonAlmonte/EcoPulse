<script lang="ts">
	import { goto } from '$app/navigation';
	import { issueList } from '$lib/store/issue.svelte';
	import IssueItem from './IssueItem.svelte';
	import Filter from '$lib/components/ui/Filter.svelte';
	import { Heading, PaginationNav } from 'flowbite-svelte';

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

<div class="mb-4 flex items-center justify-between">
	<Heading tag="h6">{issueList.list.pagination.total} incidencias</Heading>
	<Filter />
</div>
<div class="grid grid-cols-2 gap-4">
	{#each issueList.list.data as issue (issue.id)}
		<IssueItem {issue} />
	{/each}
</div>

<div class="mt-4 flex items-center justify-center">
	<PaginationNav {currentPage} {totalPages} onPageChange={handlePageChange} size="large" />
</div>
