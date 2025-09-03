<script lang="ts">
	import { goto } from '$app/navigation';
	import { issueList } from '$lib/store/issue.svelte';
	import { relativeTime } from '$lib/utils/relativeTime';
	import { Star } from '@lucide/svelte';
	import { Card, Heading, PaginationNav } from 'flowbite-svelte';

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
		<Card
			img={issue.photo}
			class="rounded-2xl"
			classes={{ image: 'rounded-t-2xl h-60 object-cover' }}
		>
			<div class="mx-6 my-4">
				<div class="flex items-center justify-between">
					<h5 class="text-lg font-bold text-gray-900 dark:text-white">
						{issue.category.name}
					</h5>
					<div class="flex content-center items-center">
						<div class="flex items-center">
							<Star size="21" />
							<span class="ms-0.5 text-lg font-bold">{issue.highlights}</span>
						</div>
					</div>
				</div>
				{#if issue.comment}
					<p class="mt-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
						{issue.comment.substring(0, 50)}...
					</p>
				{/if}
				<p class="mt-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
					Reportado {relativeTime(issue.createdAt)} • {new Date(issue.createdAt).toLocaleDateString(
						'es-ES',
						{
							day: '2-digit',
							month: '2-digit',
							year: 'numeric'
						}
					)}
				</p>
				<p class="mt-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
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
