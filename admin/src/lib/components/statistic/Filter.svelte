<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { statisticGraph } from '$lib/store/statistic.svelte';
	import { toastState } from '$lib/store/ui.svelte';
	import { ChevronDown } from '@lucide/svelte';
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';

	let currentFilter = $state('Últimos 7 días');

	async function filterGraph(e: Event) {
		const element = e.currentTarget as HTMLButtonElement;
		const filterLabel = element.innerText;
		const filterValue = element.dataset.filter!;

		currentFilter = filterLabel;

		const apiUrl = new URL(`statistic/status`, PUBLIC_API_URL);

		apiUrl.searchParams.set('filter', filterValue);

		const response = await fetch(apiUrl, { method: 'GET' });

		if (!response.ok) {
			toastState.trigger({
				content: 'Error al aplicar este filtro',
				color: 'red',
				icon: 'CircleX'
			});
			return;
		}

		const data = await response.json();

		console.log(data);

		statisticGraph.statistic.status = data;
	}
</script>

<div class="flex items-center justify-between pt-5">
	<Button
		class="inline-flex items-center bg-transparent py-0 text-center text-sm font-medium text-gray-500 hover:bg-transparent hover:text-gray-900 focus:ring-transparent dark:bg-transparent dark:text-gray-400 dark:hover:bg-transparent dark:hover:text-white dark:focus:ring-transparent"
	>
		{currentFilter}
		<ChevronDown class="m-2.5 ms-1.5 w-2.5" />
	</Button>
	<Dropdown simple class="w-40" offset={-6}>
		<DropdownItem data-filter="yesterday" onclick={filterGraph}>Ayer</DropdownItem>
		<DropdownItem data-filter="today" onclick={filterGraph}>Hoy</DropdownItem>
		<DropdownItem data-filter="7d" onclick={filterGraph}>Últimos 7 días</DropdownItem>
		<DropdownItem data-filter="30d" onclick={filterGraph}>Últimos 30 días</DropdownItem>
		<DropdownItem data-filter="90d" onclick={filterGraph}>Últimos 90 días</DropdownItem>
	</Dropdown>
</div>
