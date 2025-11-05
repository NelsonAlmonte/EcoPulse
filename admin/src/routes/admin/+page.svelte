<script lang="ts">
	import type { InsightProps, PageHeader } from '$lib/types/ui.type';
	import { pageHeaderState } from '$lib/store/ui.svelte';
	import Insight from '$lib/components/admin/Insight.svelte';
	import CategoryGraph from '$lib/components/statistic/CategoryGraph.svelte';
	import DateGraph from '$lib/components/statistic/DateGraph.svelte';
	import Filter from '$lib/components/ui/Filter.svelte';
	import { Heading, Card, Button } from 'flowbite-svelte';
	import { ChartColumn, FileSearch, Handshake, MapPinned, Users } from '@lucide/svelte';
	import { userSession } from '$lib/store/userSession.svelte.js';

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

<Card class="mb-8 rounded-xl p-4 sm:p-6 md:p-8" size="xl">
	<Handshake class="mb-3 h-8 w-8 text-emerald-600" />
	<h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
		Hola, {userSession.user?.name} — bienvenido al panel de administración.
	</h5>
	<p class="mb-3 font-normal text-gray-600">Opciones destacadas para una gestión más eficiente.</p>
	<div class="space-y-2 lg:space-y-0">
		<Button href="/admin/issue" color="alternative" pill>
			<FileSearch class="me-2" size="20" />
			Listado de incidencias
		</Button>

		<Button href="/admin/issue/map" color="alternative" pill>
			<MapPinned class="me-2" size="20" />
			Mapa de incidencias
		</Button>

		<Button href="/admin/statistic" color="alternative" pill>
			<ChartColumn class="me-2" size="20" />
			Reportes
		</Button>

		<Button href="/admin/user" color="alternative" pill>
			<Users class="me-2" size="20" />
			Listado de usuarios
		</Button>
	</div>
</Card>
<div class="mb-4 flex items-center justify-between">
	<Heading tag="h6">Métricas clave</Heading>
</div>
<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
	{#each insights as insight}
		<Insight insightProps={insight} />
	{/each}
</div>
<div class="mb-4 flex items-center justify-between">
	<Heading tag="h6">Incidencias de esta semana</Heading>
	<Filter />
</div>
<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
	<CategoryGraph category={data.categoryStatistic} />
	<DateGraph date={data.dateStatistic} />
</div>
