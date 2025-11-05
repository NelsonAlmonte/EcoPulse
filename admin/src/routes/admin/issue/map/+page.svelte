<script lang="ts">
	import type { PageHeader } from '$lib/types/ui.type';
	import { pageHeaderState } from '$lib/store/ui.svelte';
	import IssueList from '$lib/components/issue/IssueList.svelte';
	import ExploreMap from '$lib/components/issue/ExploreMap.svelte';
	import type { PageProps } from './$types';
	import { issueList } from '$lib/store/issue.svelte';

	let { data }: PageProps = $props();
	const pageHeaderProps: PageHeader = {
		title: 'Mapa de incidencias',
		back_url: '/admin/issue',
		breadcrumbs: [
			{
				title: 'Inicio',
				url: '/admin'
			},
			{
				title: 'Incidencias',
				url: '/admin/issue'
			},
			{
				title: 'Mapa',
				url: '/'
			}
		]
	};

	$effect(() => {
		issueList.list = data.issues;
	});

	Object.assign(pageHeaderState, pageHeaderProps);
</script>

<div class="grid grid-cols-1 gap-8 lg:h-[calc(100vh-300px)] lg:grid-cols-2">
	<div class="order-1 lg:order-2">
		<ExploreMap lat={data.mapParams.lat} lng={data.mapParams.lng} zoom={data.mapParams.zoom} />
	</div>
	<div class="no-scrollbar order-2 overflow-y-scroll pb-10 lg:order-1">
		<IssueList />
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
