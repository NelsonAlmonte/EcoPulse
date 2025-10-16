<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/ui/Sidebar.svelte';
	import PageLoad from '$lib/components/ui/PageLoad.svelte';
	import Navbar from '$lib/components/ui/Navbar.svelte';
	import Header from '$lib/components/ui/Header.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				console.log('newsession', newSession);
				console.log('sessuib', session);
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
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
