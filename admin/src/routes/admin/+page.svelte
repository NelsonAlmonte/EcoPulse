<script lang="ts">
	import type { PageHeader } from '$lib/types/ui.type';
	import { pageHeaderState } from '$lib/store/ui.svelte';

	let { data } = $props();
	let { supabase } = $derived(data);

	async function logout() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
	}

	const pageHeaderProps: PageHeader = {
		title: 'Inicio'
	};

	Object.assign(pageHeaderState, pageHeaderProps);
</script>

<button onclick={logout}>Logout</button>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<a href="/admin">Admin</a>
