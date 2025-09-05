<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import type { Category } from '$lib/models/category.model';
	import { SlidersHorizontal } from '@lucide/svelte';
	import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let isModalOpen = $state(true);
	let categories = $state<Category[]>([]);

	onMount(async () => {
		categories = await getCategories();
	});

	async function getCategories() {
		const apiUrl = new URL('category', PUBLIC_API_URL);
		const response = await fetch(apiUrl);
		return (await response.json()) as Category[];
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
		<ul
			class="w-full items-center divide-x divide-gray-200 rounded-lg border border-gray-200 sm:flex rtl:divide-x-reverse dark:divide-gray-600 dark:border-gray-600 dark:bg-gray-800"
		>
			<li class="w-full"><Checkbox classes={{ div: 'p-3' }}>Pendiente</Checkbox></li>
			<li class="w-full"><Checkbox classes={{ div: 'p-3' }}>Resuelto</Checkbox></li>
			<li class="w-full"><Checkbox classes={{ div: 'p-3' }}>Descartado</Checkbox></li>
		</ul>
		<p class="mb-4 font-semibold text-gray-900 dark:text-white">Fecha de reporte</p>
		<div class="mb-6 grid gap-6 md:grid-cols-2">
			<div>
				<Label for="date_from" class="mb-2">Desde</Label>
				<Input type="date" id="date_from" />
			</div>
			<div>
				<Label for="date_to" class="mb-2">Hasta</Label>
				<Input type="date" id="date_to" />
			</div>
		</div>
		<p class="mb-4 font-semibold text-gray-900 dark:text-white">Categorias</p>
		<div class="grid w-full grid-cols-2 gap-2">
			{#each categories as category}
				<div class="w-full">
					<Checkbox custom classes={{ div: 'w-full flex-1' }}>
						<div
							class="w-full cursor-pointer rounded-xl border-2 border-gray-200 bg-white p-3 font-normal text-gray-900 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-emerald-600 peer-checked:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-gray-300"
						>
							<div class="w-full text-sm font-semibold">{category.name}</div>
						</div>
					</Checkbox>
				</div>
			{/each}
		</div>
	</div>
</Modal>
