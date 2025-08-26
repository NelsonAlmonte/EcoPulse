<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { CircleAlert } from '@lucide/svelte';
	import { Button, Modal } from 'flowbite-svelte';

	let data: { onDeleted(): void; id: string } = $props();
	let showModal = $state(false);

	async function deleteItem() {
		const apiUrl = new URL(`issue/${data.id}`, PUBLIC_API_URL);
		const response = await fetch(apiUrl, { method: 'DELETE' });

		if (!response.ok) {
			// TODO: Handle error
			console.log(response);
			console.log('error');
			return;
		}

		data.onDeleted();

		//TODO: Handle success
	}
</script>

<Button color="red" pill onclick={() => (showModal = true)}>Eliminar</Button>

<Modal bind:open={showModal} size="xs" permanent>
	<div class="text-center">
		<CircleAlert class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			¿Desea eliminar esta incidencia?
		</h3>
		<div class="space-x-2">
			<Button color="red" onclick={deleteItem}>Si, eliminar</Button>
			<Button color="alternative" onclick={() => (showModal = false)}>No, cancelar</Button>
		</div>
	</div>
</Modal>
