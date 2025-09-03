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
		back_url: '/issue',
		breadcrumbs: [
			{
				title: 'Inicio',
				url: '/'
			},
			{
				title: 'Incidencias',
				url: '/issue'
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

<div class="grid h-[calc(100vh-300px)] grid-cols-2 gap-8">
	<div class="no-scrollbar overflow-y-scroll pb-10">
		<IssueList />
	</div>
	<div>
		<ExploreMap />
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
