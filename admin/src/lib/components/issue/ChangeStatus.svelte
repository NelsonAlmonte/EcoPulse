<script lang="ts">
	import type { StatusTypes } from '$lib/types/system.type';
	import type { Snippet } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { toastState } from '$lib/store/ui.svelte';

	let {
		id,
		status,
		onChanged,
		children
	}: {
		id: string;
		status: StatusTypes;
		onChanged(): void;
		children: Snippet<[isLoading: boolean | undefined, status: string]>;
	} = $props();
	let isLoading = $state(false);

	async function changeStatus() {
		isLoading = true;

		const apiUrl = new URL(`issue/${id}`, PUBLIC_API_URL);
		const response = await fetch(apiUrl, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status: status.toUpperCase() })
		});

		if (!response.ok) {
			toastState.trigger({
				content: 'Error al cambiar el estado',
				color: 'red',
				icon: 'CircleX'
			});
			return;
		}

		onChanged();

		toastState.trigger({
			content: 'Estado actualizado',
			color: 'emerald',
			icon: 'CircleCheck'
		});

		isLoading = false;
	}
</script>

<button onclick={() => changeStatus()}>
	{@render children(isLoading, status)}
</button>
<br />
