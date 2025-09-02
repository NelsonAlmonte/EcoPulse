<script lang="ts">
	import { goto } from '$app/navigation';
	import { issueList } from '$lib/store/issue.svelte';
	import { Card, Heading, PaginationNav } from 'flowbite-svelte';

	let currentPage = $derived(issueList.list.pagination.page);
	let currentAmount = $derived(issueList.list.pagination.amount);
	let totalPages = $derived(
		Math.ceil(issueList.list.pagination.total / issueList.list.pagination.amount)
	);

	function handlePageChange(page: number) {
		currentPage = page;

		const newUrl = new URL(window.location.href.split('?')[0]);

		newUrl.searchParams.set('page', currentPage.toString());
		newUrl.searchParams.set('amount', issueList.list.pagination.amount.toString() ?? '5');

		goto(newUrl);
	}
</script>

<Heading class="mb-4" tag="h6">{issueList.list.pagination.total} incidencias</Heading>
<div class="grid grid-cols-2 gap-4">
	{#each issueList.list.data as issue (issue.id)}
		<Card img={issue.photo}>
			<div class="m-6">
				<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					{issue.category.name}
				</h5>
				<p class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
					{issue.user.name}
					{issue.user.last}
				</p>
			</div>
		</Card>
	{/each}
</div>

<div class="mt-4 flex items-center justify-center">
	<PaginationNav {currentPage} {totalPages} onPageChange={handlePageChange} size="large" />
</div>
