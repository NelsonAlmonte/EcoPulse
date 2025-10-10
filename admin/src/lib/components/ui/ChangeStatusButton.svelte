<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { toastState } from '$lib/store/ui.svelte';
	import { CircleAlert } from '@lucide/svelte';
	import { Button, Modal, Spinner } from 'flowbite-svelte';
	import type { Snippet } from 'svelte';

	let {
		endpoint,
		id,
		status,
		onChaged,
		children
	}: { endpoint: string; id: string; status: boolean; onChaged(): void; children: Snippet<[]> } =
		$props();
	let isConfirmationModalOpen = $state(false);
	let isLoading = $state(false);

	async function changeStatus() {
		isLoading = true;

		const apiUrl = new URL(`${endpoint}/${id}`, PUBLIC_API_URL);
		const response = await fetch(apiUrl, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ isActive: !status })
		});

		if (!response.ok) {
			toastState.trigger({
				content: 'Error al actualizar el estado de este registro',
				color: 'red',
				icon: 'CircleX'
			});
			return;
		}

		onChaged();

		toastState.trigger({
			content: 'Estado actualizado',
			color: 'emerald',
			icon: 'CircleCheck'
		});

		isLoading = false;
		isConfirmationModalOpen = false;
	}
</script>

<div
	class="cursor-pointer"
	role="button"
	tabindex="0"
	onclick={() => (isConfirmationModalOpen = true)}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			isConfirmationModalOpen = true;
		}
	}}
>
	{@render children()}
</div>

<Modal bind:open={isConfirmationModalOpen} size="xs" permanent>
	<div class="text-center">
		<CircleAlert class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			¿Desea actualizar el estado de este registro?
		</h3>
		<div class="space-x-2">
			<Button color={status ? 'red' : 'emerald'} onclick={changeStatus} disabled={isLoading}>
				{#if isLoading}
					<Spinner class="me-3" size="4" color="red" />
					Cargando...
				{:else if status}
					Si, desactivar
				{:else}
					Si, activar
				{/if}
			</Button>
			<Button color="alternative" onclick={() => (isConfirmationModalOpen = false)}
				>No, cancelar</Button
			>
		</div>
	</div>
</Modal>
