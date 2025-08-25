<script lang="ts">
	import type { PageProps } from './$types';
	import type { PageHeader } from '$lib/types/ui.type';
	import { Button, PaginationNav } from 'flowbite-svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { pageHeaderState } from '$lib/store/ui.svelte';

	let { data }: PageProps = $props();
	let isLoading = $state(false);
	let currentPage = $derived(Number(data.currentPage));
	let totalPages = $derived(
		Math.ceil(data.issues.pagination.total / data.issues.pagination.amount)
	);

	function handlePageChange(page: number) {
		currentPage = page;
		isLoading = true;

		const newUrl = new URL(window.location.href.split('?')[0]);

		newUrl.searchParams.set('page', currentPage.toString());
		newUrl.searchParams.set('amount', data.issues.pagination.amount.toString() ?? '5');

		goto(newUrl);
	}
	afterNavigate(() => (isLoading = false));

	const pageHeaderProps: PageHeader = {
		title: 'Listado de incidencias',
		breadcrumbs: [
			{
				title: 'Inicio',
				url: '/'
			},
			{
				title: 'Incidencias',
				url: '/issue'
			},
			{
				title: 'Listado',
				url: '/issue'
			}
		]
	};

	Object.assign(pageHeaderState, pageHeaderProps);
</script>

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
	<table class="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
		<thead class="text-xs uppercase text-gray-700 dark:text-gray-400">
			<tr>
				<th scope="col" class="bg-gray-50 px-6 py-3 dark:bg-gray-800"> Id </th>
				<th scope="col" class="px-6 py-3 dark:bg-gray-800"> Categoria </th>
				<th scope="col" class="bg-gray-50 px-6 py-3"> Reportante </th>
				<th scope="col" class=" px-6 py-3 dark:bg-gray-800"> Estado </th>
				<th scope="col" class="bg-gray-50 px-6 py-3"> Comentario </th>
				<th scope="col" class="px-6 py-3 dark:bg-gray-800"> Fecha </th>
				<th scope="col" class="bg-gray-50 px-6 py-3"> Accciones </th>
			</tr>
		</thead>
		<tbody>
			{#if !isLoading}
				{#each data.issues.data as issue (issue.id)}
					<tr class="border-b border-gray-200 dark:border-gray-700">
						<th
							scope="row"
							class="whitespace-nowrap bg-gray-50 px-6 py-4 font-medium text-gray-900 dark:bg-gray-800 dark:text-white"
						>
							{issue.id}
						</th>
						<td class="px-6 py-4"> {issue.category.name} </td>
						<td class="bg-gray-50 px-6 py-4 dark:bg-gray-800">
							{issue.user.name}
							{issue.user.last}
						</td>
						<td class="px-6 py-4"> {issue.status} </td>
						<td class="bg-gray-50 px-6 py-4 dark:bg-gray-800">
							{#if issue.comment}
								{issue.comment.substring(0, 20)}...
							{/if}
						</td>
						<td class="px-6 py-4">
							{new Date(issue.createdAt).toLocaleDateString('es-ES', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric'
							})}
						</td>
						<td class="bg-gray-50 px-6 py-4 dark:bg-gray-800">
							<a href="issue/{issue.id}">
								<Button color="alternative" pill>Ver</Button>
							</a>
							<Button color="red" pill>Eliminar</Button>
						</td>
					</tr>
				{/each}
			{:else}
				{#each { length: 5 }}
					<tr class="border-b border-gray-200 dark:border-gray-700">
						{#each { length: 7 }}
							<td class="px-6 py-4">
								<div role="status" class="max-w-sm animate-pulse">
									<div class="mb-4 h-2.5 w-36 rounded-full bg-gray-200 dark:bg-gray-700"></div>
									<span class="sr-only">Loading...</span>
								</div>
							</td>
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>

<div class="mt-4 flex items-center justify-center">
	<PaginationNav {currentPage} {totalPages} onPageChange={handlePageChange} size="large" />
</div>
