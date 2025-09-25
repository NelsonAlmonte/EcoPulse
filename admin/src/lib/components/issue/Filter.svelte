<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import type { Category } from '$lib/models/category.model';
	import { SlidersHorizontal } from '@lucide/svelte';
	import {
		Button,
		Modal,
		Label,
		Input,
		Checkbox,
		Radio,
		type CheckboxItem,
		Helper
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let isModalOpen = $state(false);
	let categories: string[] = $state([]);
	let status: string[] = $state([]);
	let startDate = $state('');
	let endDate = $state('');
	let definedDate = $state('7d');
	let selectedOrder = $state('createdAt:desc');
	const statusChoices: CheckboxItem[] = [
		{ value: 'PENDIENTE', label: 'Pendiente' },
		{ value: 'RESUELTO', label: 'Resuelto' },
		{ value: 'DESCARTADO', label: 'Descartado' }
	];
	let categoryChoices: CheckboxItem[] = $state([]);
	let isLoading = $state(true);
	let showValidation = $state(false);

	onMount(async () => {
		const categories = await getCategories();

		isLoading = false;

		categoryChoices = categories.map((category) => {
			return { value: category.id, label: category.name };
		});
	});

	async function getCategories() {
		const apiUrl = new URL('category', PUBLIC_API_URL);
		const response = await fetch(apiUrl);

		return (await response.json()) as Category[];
	}

	function applyFilters() {
		const dateFilters = getDateFilters();

		if (dateFilters.end_date && !dateFilters.start_date) {
			showValidation = true;
			return;
		}

		const filters = [
			{
				name: 'status',
				value: status.length ? status.join(',') : null
			},
			{
				name: 'start_date',
				value: dateFilters.start_date ? dateFilters.start_date : null
			},
			{
				name: 'end_date',
				value: dateFilters.end_date ? dateFilters.end_date : null
			},
			{
				name: 'defined_date',
				value: dateFilters.defined_date ? dateFilters.defined_date : null
			},
			{
				name: 'categories',
				value: categories.length ? categories.join(',') : null
			},
			{
				name: 'order',
				value: selectedOrder
			}
		];

		const newUrl = new URL(window.location.href);

		for (const filter of filters) {
			if (filter.value) newUrl.searchParams.set(filter.name, filter.value);
			else newUrl.searchParams.delete(filter.name);
		}

		isModalOpen = false;

		goto(newUrl, { noScroll: true });
	}

	function getDateFilters() {
		if (startDate && !endDate) endDate = new Date().toISOString().split('T')[0];

		if (startDate && endDate) {
			return {
				start_date: startDate,
				end_date: endDate
			};
		} else {
			return {
				defined_date: definedDate
			};
		}
	}
</script>

<Button onclick={() => (isModalOpen = true)} color="alternative" pill>
	<SlidersHorizontal class="me-2" size="20" />
	Filtros
</Button>

<Modal form bind:open={isModalOpen} size="xs">
	<div class="flex flex-col space-y-6">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Filtros</h3>
		<p class="mb-4 font-semibold text-gray-900 dark:text-white">Estado</p>
		<div
			class="flex w-full items-center justify-between divide-x divide-gray-200 rounded-lg border border-gray-200 sm:flex rtl:divide-x-reverse dark:divide-gray-600 dark:border-gray-600 dark:bg-gray-800"
		>
			<Checkbox
				inline
				choices={statusChoices}
				bind:group={status}
				classes={{ div: 'p-3 flex-1' }}
			/>
		</div>
		<p class="mb-4 font-semibold text-gray-900 dark:text-white">Rango de fecha personalizado</p>
		<div class="mb-6 grid gap-6 md:grid-cols-2">
			<div>
				<Label color={showValidation ? 'red' : undefined} for="start_date" class="mb-2">Desde</Label
				>
				<Input
					color={showValidation ? 'red' : undefined}
					type="date"
					id="start_date"
					bind:value={startDate}
					onchange={() => (showValidation = false)}
				/>
				{#if showValidation}
					<Helper color={showValidation ? 'red' : undefined} class="mt-2"
						>Es necesario completar este campo</Helper
					>
				{/if}
			</div>
			<div>
				<Label for="end_date" class="mb-2">Hasta</Label>
				<Input type="date" id="end_date" bind:value={endDate} />
			</div>
		</div>
		<p class="mb-4 font-semibold text-gray-900 dark:text-white">Rango de fecha definido</p>
		<div class="space-y-3">
			<Radio value="yesterday" bind:group={definedDate}>Ayer</Radio>
			<Radio value="today" bind:group={definedDate}>Hoy</Radio>
			<Radio value="7d" bind:group={definedDate}>Últimos 7 días</Radio>
			<Radio value="30d" bind:group={definedDate}>Últimos 30 días</Radio>
			<Radio value="90d" bind:group={definedDate}>Últimos 90 días</Radio>
		</div>
		<p class="mb-4 font-semibold text-gray-900 dark:text-white">Categorias</p>
		<div class="grid w-full grid-cols-2 gap-4">
			{#if isLoading}
				{#each { length: 10 }}
					<div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
				{/each}
			{:else}
				<Checkbox choices={categoryChoices} bind:group={categories} />
			{/if}
		</div>
		<p class="mb-4 font-semibold text-gray-900 dark:text-white">Ordenar por</p>
		<div class="space-y-3">
			<Radio value="createdAt:desc" bind:group={selectedOrder}>Más recientes primero</Radio>
			<Radio value="createdAt:asc" bind:group={selectedOrder}>Más antiguos</Radio>
			<Radio value="highlights:desc" bind:group={selectedOrder}>Más destacados</Radio>
			<Radio value="highlights:asc" bind:group={selectedOrder}>Menos destacados</Radio>
		</div>
		<div class="flex shrink-0 items-center justify-end space-x-3 rtl:space-x-reverse">
			<Button color="alternative" onclick={() => (isModalOpen = false)}>Cerrar</Button>
			<Button color="emerald" onclick={applyFilters}>Aplicar filtros</Button>
		</div>
	</div>
</Modal>
