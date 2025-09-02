<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/ui/Sidebar.svelte';
	import PageLoad from '$lib/components/ui/PageLoad.svelte';
	import Navbar from '$lib/components/ui/Navbar.svelte';
	import Header from '$lib/components/ui/Header.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>EcoPulse - Admin</title>
</svelte:head>

<PageLoad />
<Navbar />
<Sidebar />
<Toast />

<div class="container mx-auto p-4">
	<Header />
	{@render children?.()}
</div>
