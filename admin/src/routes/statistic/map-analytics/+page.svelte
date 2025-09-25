<script lang="ts">
	import type { PageHeader } from '$lib/types/ui.type';
	import type { Statistic } from '$lib/models/statistic.model';
	import { pageHeaderState } from '$lib/store/ui.svelte';
	import CategoryGraph from '$lib/components/statistic/CategoryGraph.svelte';
	import AnalyticMap from '$lib/components/statistic/AnalyticMap.svelte';
	import { Heading } from 'flowbite-svelte';
	import Filter from '$lib/components/issue/Filter.svelte';

	let { data } = $props();
	let statistics: Record<string, Statistic[]> = $derived(data.statistics);
	const pageHeaderProps: PageHeader = {
		title: 'Mapa analítico',
		back_url: '/statistic',
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
				title: 'Mapa analítico',
				url: '/statistic/map-analytics'
			}
		]
	};

	// $effect(() => {
	// 	issueList.list = data.issues;
	// });

	Object.assign(pageHeaderState, pageHeaderProps);
</script>

<div class="grid h-[calc(100vh-300px)] grid-cols-2 gap-8">
	<div class="no-scrollbar overflow-y-scroll pb-10">
		<div class="mb-4 flex items-center justify-between">
			<Heading tag="h6">0 incidencias</Heading>
			<Filter />
		</div>
		<CategoryGraph category={statistics.category} />
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
