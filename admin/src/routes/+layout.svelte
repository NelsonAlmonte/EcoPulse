<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/ui/Sidebar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>EcoPulse - Admin</title>
</svelte:head>

<Sidebar />

<div class="h-96 overflow-auto p-4 md:ms-64">
	{@render children?.()}
</div>
