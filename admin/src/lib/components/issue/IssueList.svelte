<script lang="ts">
	import type { AlertProps } from '$lib/types/ui.type';
	import { goto } from '$app/navigation';
	import { issueList } from '$lib/store/issue.svelte';
	import IssueItem from './IssueItem.svelte';
	import Filter from '$lib/components/ui/Filter.svelte';
	import { Heading, PaginationNav } from 'flowbite-svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	let currentPage = $derived(issueList.list.pagination.page);
	let currentAmount = $derived(issueList.list.pagination.amount);
	let totalPages = $derived(
		Math.ceil(issueList.list.pagination.total / issueList.list.pagination.amount)
	);
	const alertProps: AlertProps = {
		title: 'Sin resultados',
		content: 'No se encontraron incidencias.',
		subcontent: 'Cuando haya contenido, aparecerá aquí.',
		classes: ['bg-gray-50 dark:bg-gray-700']
	};

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
{#if issueList.list.data.length}
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		{#each issueList.list.data as issue (issue.id)}
			<IssueItem {issue} />
		{/each}
	</div>
	<div class="mt-4 flex items-center justify-center">
		<PaginationNav {currentPage} {totalPages} onPageChange={handlePageChange} size="large" />
	</div>
{:else}
	<Alert {alertProps} />
{/if}
