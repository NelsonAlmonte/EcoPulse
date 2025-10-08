<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import CategoryModal from './CategoryModal.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { toastState } from '$lib/store/ui.svelte';

	let { id, name, icon, onSuccess }: { id: string; name: string; icon: string; onSuccess(): void } =
		$props();
	let isModalOpen = $state(false);
	let isLoading = $state(false);

	async function updateCategory(updatedName: string, updatedIcon: string) {
		isLoading = true;

		const apiUrl = new URL(`category/${id}`, PUBLIC_API_URL);
		const response = await fetch(apiUrl, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: updatedName, icon: updatedIcon })
		});

		if (!response.ok) {
			toastState.trigger({
				content: 'Error al actualizar esta categoria',
				color: 'red',
				icon: 'CircleX'
			});
			return;
		}

		toastState.trigger({
			content: 'Categoria actualizada',
			color: 'emerald',
			icon: 'CircleCheck'
		});

		onSuccess();

		isLoading = false;
		isModalOpen = false;
	}
</script>

<Button onclick={() => (isModalOpen = true)} color="alternative" pill>Editar</Button>

<CategoryModal
	{isModalOpen}
	{isLoading}
	type={'UPDATE'}
	initialName={name}
	initialIcon={icon}
	onOperation={(name, icon) => updateCategory(name, icon)}
	onClose={() => (isModalOpen = false)}
/>
