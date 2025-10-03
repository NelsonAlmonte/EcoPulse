<script lang="ts">
	import type { AlertProps, PageHeader } from '$lib/types/ui.type';
	import { pageHeaderState, toastState } from '$lib/store/ui.svelte';
	import * as lucide from '@lucide/svelte/icons';
	import { PlusIcon } from '@lucide/svelte/icons';
	import { type Icon as IconType } from '@lucide/svelte';
	import { Button, Heading, Input, Label, Modal, Popover, Tooltip } from 'flowbite-svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

	type LucideIcon = {
		name: string;
		icon: typeof IconType;
	};
	let { data } = $props();
	let isLoading = $state(false);
	let isModalOpen = $state(true);
	let iconToSearch = $state('');
	let categoryName = $state('');
	let icons: LucideIcon[] = $derived(
		Object.entries(lucide)
			.filter((icon) => icon[0].includes('Icon'))
			.filter((icon) => icon[0].includes(iconToSearch))
			.map((val) => ({ name: val[0], icon: val[1] as typeof IconType }))
			.slice(0, 32)
	);
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
	const alertProps: AlertProps = {
		title: 'Sin resultados',
		content: 'No encontramos ningún ícono que coincida con tu búsqueda.',
		subcontent: 'Intenta con otro término o revisa la lista completa de iconos.',
		classes: ['bg-gray-50 dark:bg-gray-700']
	};

	Object.assign(pageHeaderState, pageHeaderProps);

	async function saveCategory() {
		isLoading = true;

		const apiUrl = new URL(`category`, PUBLIC_API_URL);
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: categoryName, icon: iconToSearch })
		});

		if (!response.ok) {
			toastState.trigger({
				content: 'Error al agregar esta categoria',
				color: 'red',
				icon: 'CircleX'
			});
			return;
		}

		toastState.trigger({
			content: 'Categoria agregada',
			color: 'emerald',
			icon: 'CircleCheck'
		});

		isLoading = false;
		isModalOpen = false;
	}
</script>

<div class="mb-4 flex items-center justify-between">
	<Heading tag="h6">{data.categories.length} categorias</Heading>
	<Button onclick={() => (isModalOpen = true)} color="alternative" pill>
		<PlusIcon class="me-2" size="20" />
		Agregar
	</Button>
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
<Modal bind:open={isModalOpen} size="xs">
	<div class="flex flex-col space-y-6">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Agrega una categoria</h3>
		<Label class="space-y-2">
			<span>Nombre</span>
			<Input
				type="text"
				name="name"
				placeholder="Punto de basura, lampara caida, señalización faltante, etc"
				autocomplete="off"
				required
				bind:value={categoryName}
			/>
		</Label>
		<Label class="space-y-2">
			<span>Icono</span>
			<Input
				type="text"
				name="icon"
				id="icon"
				placeholder="Buscar icono"
				autocomplete="off"
				required
				bind:value={iconToSearch}
			/>
		</Label>
		<Popover
			class="w-110 text-sm font-light "
			triggeredBy="#icon"
			trigger="click"
			placement="bottom"
		>
			{#if icons.length}
				<div class="grid grid-cols-8 gap-2">
					{#each icons as icon (icon.name)}
						{@const Icon = icon.icon}
						<button
							class="flex cursor-pointer justify-center rounded-lg bg-gray-50 p-3 hover:bg-gray-100 dark:bg-gray-700"
							type="button"
							onclick={() => (iconToSearch = icon.name)}
						>
							<Tooltip>{icon.name}</Tooltip>
							<Icon size="24" />
						</button>
					{/each}
				</div>
			{:else}
				<Alert {alertProps} />
			{/if}
		</Popover>
		<div class="flex shrink-0 items-center justify-end space-x-3 rtl:space-x-reverse">
			<Button color="alternative" onclick={() => (isModalOpen = false)}>Cerrar</Button>
			<Button color="emerald" onclick={saveCategory}>Guardar</Button>
		</div>
	</div>
</Modal>
