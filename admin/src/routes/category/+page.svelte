<script lang="ts">
	import type { PageHeader } from '$lib/types/ui.type';
	import { pageHeaderState } from '$lib/store/ui.svelte';
	import * as lucide from '@lucide/svelte/icons';
	import { type Icon as IconType } from '@lucide/svelte';

	type LucideIcon = {
		name: string;
		icon: typeof IconType;
	};
	let { data } = $props();
	let isLoading = $state(false);
	const icons: LucideIcon[] = Object.entries(lucide)
		.filter((icon) => icon[0].includes('Icon'))
		.map((val) => ({ name: val[0], icon: val[1] as typeof IconType }));
	const pageHeaderProps: PageHeader = {
		title: 'Listado de categorias',
		back_url: '/',
		breadcrumbs: [
			{
				title: 'Inicio',
				url: '/'
			},
			{
				title: 'Configuración',
				url: '/category'
			},
			{
				title: 'Listado',
				url: '/category'
			}
		]
	};

	Object.assign(pageHeaderState, pageHeaderProps);
</script>

<div class="grid grid-cols-8">
	{#each icons as icon}
		{@const Icon = icon.icon}
		<div>
			<Icon />
			<small>{icon.name}</small>
		</div>
	{/each}
</div>

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
	<table class="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
		<thead class="text-xs uppercase text-gray-700 dark:text-gray-400">
			<tr>
				<th scope="col" class="bg-gray-50 px-6 py-3 dark:bg-gray-800"> Id </th>
				<th scope="col" class="px-6 py-3 dark:bg-gray-800"> Nombre </th>
				<th scope="col" class="bg-gray-50 px-6 py-3"> Icono </th>
				<th scope="col" class="px-6 py-3 dark:bg-gray-800"> Fecha </th>
				<th scope="col" class="bg-gray-50 px-6 py-3"> Accciones </th>
			</tr>
		</thead>
		<tbody>
			{#if !isLoading}
				{#each data.categories as category (category.id)}
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
						<td class="bg-gray-50 px-6 py-4 dark:bg-gray-800"> </td>
					</tr>
				{/each}
			{:else}
				{#each { length: 5 }}
					<tr class="border-b border-gray-200 dark:border-gray-700">
						{#each { length: 5 }}
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
