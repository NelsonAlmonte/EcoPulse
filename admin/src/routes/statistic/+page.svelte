<script lang="ts">
	import type { PageHeader } from '$lib/types/ui.type';
	import type { Statistic } from '$lib/models/statistic.model.js';
	import { pageHeaderState } from '$lib/store/ui.svelte';
	import StatusGraph from '$lib/components/statistic/StatusGraph.svelte';
	import CategoryGraph from '$lib/components/statistic/CategoryGraph.svelte';
	import Filter from '$lib/components/statistic/Filter.svelte';
	import DateGraph from '$lib/components/statistic/DateGraph.svelte';
	import TopCategoriesGraph from '$lib/components/statistic/TopCategoriesGraph.svelte';

	let { data } = $props();
	let statistics: Record<string, Statistic[]> = $derived(data.statistics);
	const pageHeaderProps: PageHeader = {
		title: 'Reportes',
		back_url: '/',
		breadcrumbs: [
			{
				title: 'Inicio',
				url: '/'
			},
			{
				title: 'Estadísticas',
				url: '/statistic'
			},
			{
				title: 'Reportes',
				url: '/statistic'
			}
		]
	};

	Object.assign(pageHeaderState, pageHeaderProps);
</script>

<div class="mb-4">
	<Filter />
</div>
<div class="flex flex-wrap gap-4">
	<StatusGraph status={statistics.status} />
	<CategoryGraph category={statistics.category} />
	<DateGraph date={statistics.date} />
	<TopCategoriesGraph category={statistics.category} />
</div>
