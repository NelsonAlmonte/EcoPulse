<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { userSession } from '$lib/store/userSession.svelte';
	import favicon from '$lib/assets/favicon.svg';

	let { data, children } = $props();
	let { session, supabase, loggedUser } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (loggedUser) {
				userSession.user = loggedUser;
			}

			if (newSession?.expires_at !== session?.expires_at) {
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

{@render children?.()}
