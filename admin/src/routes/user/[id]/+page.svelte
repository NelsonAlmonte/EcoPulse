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
		// TODO: Cambiar el endpoint para que retorne list. Revisar lo de las imagenes
		issueList.list.data = data.issues;
	});

	Object.assign(pageHeaderState, pageHeaderProps);

	console.log(data);
</script>

<IssueList />
