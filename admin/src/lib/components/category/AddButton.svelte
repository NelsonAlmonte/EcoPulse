<script lang="ts">
	import { PlusIcon } from '@lucide/svelte';
	import { Button } from 'flowbite-svelte';
	import CategoryModal from './CategoryModal.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { toastState } from '$lib/store/ui.svelte';

	let { onSuccess }: { onSuccess(): void } = $props();
	let isModalOpen = $state(false);
	let isLoading = $state(false);

	async function saveCategory(name: string, icon: string) {
		isLoading = true;

		const apiUrl = new URL(`category`, PUBLIC_API_URL);
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name, icon })
		});

		if (!response.ok) {
			toastState.trigger({
				content: 'Error al agregar esta categoria',
				color: 'red',
				icon: 'CircleX'
			});
			return;
		}

		toastState.trigger({
			content: 'Categoria agregada',
			color: 'emerald',
			icon: 'CircleCheck'
		});

		onSuccess();

		isLoading = false;
		isModalOpen = false;
	}
</script>

<Button onclick={() => (isModalOpen = true)} color="alternative" pill>
	<PlusIcon class="me-2" size="20" />
	Agregar
</Button>

<CategoryModal
	{isModalOpen}
	type={'CREATE'}
	onOperation={(name, icon) => saveCategory(name, icon)}
/>
