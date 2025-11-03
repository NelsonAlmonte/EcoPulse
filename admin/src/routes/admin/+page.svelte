<script lang="ts">
	import type { InsightProps, PageHeader } from '$lib/types/ui.type';
	import { pageHeaderState } from '$lib/store/ui.svelte';
	import Insight from '$lib/components/admin/Insight.svelte';

	let { data } = $props();
	const insights: InsightProps[] = [
		{
			label: 'Total de incidencias',
			value: data.issuesCount,
			icon: 'FileSearch'
		},
		{
			label: 'Incidencias pendientes',
			value: data.pendingIssuesCount,
			icon: 'FileQuestionMark'
		},
		{
			label: 'Incidencias resueltas',
			value: data.resolvedIssuesCount,
			icon: 'FileCheck'
		},
		{
			label: 'Usuarios activos',
			value: data.activeUsersCount,
			icon: 'Users'
		}
	];
	const pageHeaderProps: PageHeader = {
		title: 'Inicio',
		back_url: '',
		breadcrumbs: [
			{
				title: 'Inicio',
				url: '/admin'
			}
		]
	};

	Object.assign(pageHeaderState, pageHeaderProps);
</script>

<div class="grid grid-cols-4 gap-x-4">
	{#each insights as insight}
		<Insight insightProps={insight} />
	{/each}
</div>
