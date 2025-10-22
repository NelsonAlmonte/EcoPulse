<script lang="ts">
	import type { PageHeader } from '$lib/types/ui.type';
	import { pageHeaderState } from '$lib/store/ui.svelte';
	import { Button, Heading, PaginationNav } from 'flowbite-svelte';
	import { categoryList } from '$lib/store/category.svelte.js';
	import { afterNavigate, goto } from '$app/navigation';
	import AddButton from '$lib/components/category/AddButton.svelte';
	import EditButton from '$lib/components/category/EditButton.svelte';
	import ChangeStatusButton from '$lib/components/ui/ChangeStatusButton.svelte';
	import Status from '$lib/components/ui/Status.svelte';

	let { data } = $props();
	let isLoading = $state(false);
	let currentPage = $derived(Number(data.pagination.page));
	let currentAmount = $derived(Number(data.pagination.amount));
	let totalPages = $derived(
		Math.ceil(data.categories.pagination.total / data.categories.pagination.amount)
	);
	const pageHeaderProps: PageHeader = {
		title: 'Listado de categorias',
		back_url: '/admin/category',
		breadcrumbs: [
			{
				title: 'Inicio',
				url: '/admin'
			},
			{
				title: 'Configuración',
				url: '/admin/category'
			},
			{
				title: 'Listado',
				url: '/admin/category'
			}
		]
	};

	function handlePageChange(page: number) {
		currentPage = page;
		isLoading = true;

		const newUrl = new URL(window.location.href);

		newUrl.searchParams.set('page', currentPage.toString());
		newUrl.searchParams.set('amount', data.categories.pagination.amount.toString() ?? '5');

		goto(newUrl);
	}

	afterNavigate(() => {
		isLoading = false;
		categoryList.list = data.categories;
	});

	categoryList.list = data.categories;

	Object.assign(pageHeaderState, pageHeaderProps);
</script>

<div class="mb-4 flex items-center justify-between">
	<Heading tag="h6">{categoryList.list.pagination.total} categorias</Heading>
	<AddButton
		onSuccess={() => categoryList.refresh(currentPage.toString(), currentAmount.toString())}
	/>
</div>
<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
	<table class="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
		<thead class="text-xs uppercase text-gray-700 dark:text-gray-400">
			<tr>
				<th scope="col" class="bg-gray-50 px-6 py-3 dark:bg-gray-800"> Id </th>
				<th scope="col" class="px-6 py-3 dark:bg-gray-800"> Nombre </th>
				<th scope="col" class="bg-gray-50 px-6 py-3"> Icono </th>
				<th scope="col" class="px-6 py-3 dark:bg-gray-800"> Fecha </th>
				<th scope="col" class="bg-gray-50 px-6 py-3"> Estado </th>
				<th scope="col" class=" px-6 py-3"> Accciones </th>
			</tr>
		</thead>
		<tbody>
			{#if !isLoading}
				{#each categoryList.list.data as category (category.id)}
					<tr class="border-b border-gray-200 dark:border-gray-700">
						<th
							scope="row"
							class="whitespace-nowrap bg-gray-50 px-6 py-4 font-medium text-gray-900 dark:bg-gray-800 dark:text-white"
						>
							{category.id}
						</th>
						<td class="px-6 py-4"> {category.name} </td>
						<td class="bg-gray-50 px-6 py-4 dark:bg-gray-800">
							{category.icon}
						</td>
						<td class="px-6 py-4">
							{new Date(category.createdAt).toLocaleDateString('es-ES', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric'
							})}
						</td>
						<td class=" bg-gray-50 px-6 py-4 dark:bg-gray-800">
							{#if category.isActive === true}
								<Status status={'activo'} />
							{:else}
								<Status status={'desactivado'} />
							{/if}
						</td>
						<td class="flex gap-x-2 px-6 py-4">
							<EditButton
								id={category.id}
								name={category.name}
								icon={category.icon}
								onSuccess={() =>
									categoryList.refresh(currentPage.toString(), currentAmount.toString())}
							/>
							<ChangeStatusButton
								endpoint={'category'}
								id={category.id}
								status={category.isActive}
								onChaged={() =>
									categoryList.refresh(currentPage.toString(), currentAmount.toString())}
							>
								{#if category.isActive === true}
									<Button color="red" pill>Desactivar</Button>
								{:else}
									<Button color="emerald" pill>Activar</Button>
								{/if}
							</ChangeStatusButton>
						</td>
					</tr>
				{/each}
			{:else}
				{#each { length: 5 }}
					<tr class="border-b border-gray-200 dark:border-gray-700">
						{#each { length: 6 }}
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
