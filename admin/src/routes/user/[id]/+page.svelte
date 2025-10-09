<script lang="ts">
	import type { PageHeader } from '$lib/types/ui.type.js';
	import { pageHeaderState } from '$lib/store/ui.svelte';
	import IssueList from '$lib/components/issue/IssueList.svelte';
	import { issueList } from '$lib/store/issue.svelte';

	let { data } = $props();

	const pageHeaderProps: PageHeader = {
		title: 'Detalles del usuario',
		back_url: '/user',
		breadcrumbs: [
			{
				title: 'Inicio',
				url: '/'
			},
			{
				title: 'Usuarios',
				url: '/user'
			},
			{
				title: 'Listado',
				url: '/user'
			},
			{
				title: 'Detalles',
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
		<h1>Hola hola hola</h1>
		<h1>Hola hola hola</h1>
		<h1>Hola hola hola</h1>
		<h1>Hola hola hola</h1>
		<h1>Hola hola hola</h1>
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
