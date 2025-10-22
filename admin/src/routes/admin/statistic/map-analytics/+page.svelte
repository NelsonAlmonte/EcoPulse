<script lang="ts">
	import type { PageHeader } from '$lib/types/ui.type';
	import type { Statistic } from '$lib/models/statistic.model';
	import { pageHeaderState } from '$lib/store/ui.svelte';
	import CategoryGraph from '$lib/components/statistic/CategoryGraph.svelte';
	import AnalyticMap from '$lib/components/statistic/AnalyticMap.svelte';
	import { Heading } from 'flowbite-svelte';
	import Filter from '$lib/components/ui/Filter.svelte';
	import StatusGraph from '$lib/components/statistic/StatusGraph.svelte';
	import DateGraph from '$lib/components/statistic/DateGraph.svelte';
	import TopCategoriesGraph from '$lib/components/statistic/TopCategoriesGraph.svelte';

	let { data } = $props();
	let statistics: Record<string, Statistic[]> = $derived(data.statistics);
	let totalIssues = $derived.by(() => {
		return statistics.category.reduce(
			(accumulator, currentValue) => accumulator + currentValue.value,
			0
		);
	});
	const pageHeaderProps: PageHeader = {
		title: 'Mapa analítico',
		back_url: '/admin/statistic',
		breadcrumbs: [
			{
				title: 'Inicio',
				url: '/admin'
			},
			{
				title: 'Estadísticas',
				url: '/admin/statistic'
			},
			{
				title: 'Mapa analítico',
				url: '/admin/statistic/map-analytics'
			}
		]
	};

	Object.assign(pageHeaderState, pageHeaderProps);
</script>

<div class="grid h-[calc(100vh-300px)] grid-cols-2 gap-8">
	<div class="no-scrollbar overflow-y-scroll pb-10">
		<div class="mb-4 flex items-center justify-between">
			<Heading tag="h6">{totalIssues} incidencias</Heading>
			<Filter />
		</div>
		<div class="grid grid-cols-1 gap-4">
			<StatusGraph status={statistics.status} />
			<CategoryGraph category={statistics.category} />
			<TopCategoriesGraph category={statistics.category} />
			<DateGraph date={statistics.date} />
		</div>
	</div>
	<div>
		<AnalyticMap />
	</div>
</div>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}

	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
