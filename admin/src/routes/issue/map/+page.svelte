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

<div class="grid min-h-screen grid-cols-2 gap-8">
	<div>
		<IssueList />
	</div>
	<div class="sticky top-0 max-h-dvh py-10">
		<ExploreMap />
	</div>
</div>
