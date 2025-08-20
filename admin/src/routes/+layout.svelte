<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/ui/Sidebar.svelte';
	import PageLoad from '$lib/components/ui/PageLoad.svelte';
	import Navbar from '$lib/components/ui/Navbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>EcoPulse - Admin</title>
</svelte:head>

<PageLoad />
<Navbar />
<Sidebar />

<div class="p-4 md:ms-64">
	{@render children?.()}
</div>
