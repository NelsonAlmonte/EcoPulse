<script lang="ts">
	import type { PageHeader } from '$lib/types/ui.type';
	import { pageHeaderState } from '$lib/store/ui.svelte';
	import StatusGraph from '$lib/components/statistic/StatusGraph.svelte';
	import CategoryGraph from '$lib/components/statistic/CategoryGraph.svelte';

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

<div class="flex gap-4">
	<StatusGraph />
	<CategoryGraph />
</div>
