<script lang="ts">
	import type { PageProps } from './$types';
	import type { PageHeader } from '$lib/types/ui.type';
	import { pageHeaderState } from '$lib/store/ui.svelte';
	import Filter from '$lib/components/ui/Filter.svelte';
	import Heatmap from '$lib/components/statistic/Heatmap.svelte';
	import { Heading } from 'flowbite-svelte';

	let { data }: PageProps = $props();
	const pageHeaderProps: PageHeader = {
		title: 'Mapa de calor',
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
				title: 'Mapa de calor',
				url: '/admin/statistic/heatmap'
			}
		]
	};

	Object.assign(pageHeaderState, pageHeaderProps);
</script>

<div class="mb-4 flex items-center justify-between">
	<Heading tag="h6">{data.issues.pagination.total} incidencias</Heading>
	<Filter />
</div>
<Heatmap issues={data.issues.data} />
