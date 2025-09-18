<script lang="ts">
	import { Button, Helper, Input, Label, Modal, Radio } from 'flowbite-svelte';
	import { SlidersHorizontal } from '@lucide/svelte';
	import { goto } from '$app/navigation';

	let isModalOpen = $state(true);
	let selectedFilter = $state('7d');
	let startDate = $state('');
	let endDate = $state('');
	let showValidation = $state(false);

	async function applyFilters() {
		if (endDate && !startDate) {
			showValidation = true;
			return;
		}

		if (startDate && !endDate) endDate = new Date().toISOString().split('T')[0];

		const newUrl = new URL('/statistic', window.location.origin);

		if (startDate && endDate) {
			newUrl.searchParams.set('start_date', startDate);
			newUrl.searchParams.set('end_date', endDate);
		} else {
			newUrl.searchParams.set('filter', selectedFilter);
		}

		isModalOpen = false;

		goto(newUrl, { noScroll: true });
	}
</script>

<Button onclick={() => (isModalOpen = true)} color="alternative" pill>
	<SlidersHorizontal class="me-2" size="20" />
	Filtros
</Button>

<Modal form bind:open={isModalOpen} size="xs">
	<div class="flex flex-col space-y-6">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Filtros</h3>
		<p class="mb-4 font-semibold text-gray-900 dark:text-white">Personalizado</p>
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
		<p class="mb-4 font-semibold text-gray-900 dark:text-white">Fecha</p>
		<div class="space-y-3">
			<Radio value="yesterday" bind:group={selectedFilter}>Ayer</Radio>
			<Radio value="today" bind:group={selectedFilter}>Hoy</Radio>
			<Radio value="7d" bind:group={selectedFilter}>Últimos 7 días</Radio>
			<Radio value="30d" bind:group={selectedFilter}>Últimos 30 días</Radio>
			<Radio value="90d" bind:group={selectedFilter}>Últimos 90 días</Radio>
		</div>
		<div class="flex shrink-0 items-center justify-end space-x-3 rtl:space-x-reverse">
			<Button color="alternative" onclick={() => (isModalOpen = false)}>Cerrar</Button>
			<Button color="red" onclick={applyFilters}>Aplicar filtros</Button>
		</div>
	</div>
</Modal>
