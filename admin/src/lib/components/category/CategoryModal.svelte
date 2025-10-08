<script lang="ts">
	import { type Icon as IconType } from '@lucide/svelte';
	import type { AlertProps } from '$lib/types/ui.type';
	import type { OperationTypes } from '$lib/types/system.type';
	import { Button, Input, Label, Modal, Popover, Spinner, Tooltip } from 'flowbite-svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import * as lucide from '@lucide/svelte/icons';

	type LucideIcon = {
		name: string;
		icon: typeof IconType;
	};
	let {
		isModalOpen,
		isLoading,
		type,
		initialName = '',
		initialIcon = '',
		onOperation,
		onClose
	}: {
		isModalOpen: boolean;
		isLoading: boolean;
		type: OperationTypes;
		initialName?: string;
		initialIcon?: string;
		onOperation(name: string, icon: string): void | Promise<void>;
		onClose(): void;
	} = $props();
	let categoryName = $state(initialName);
	let iconToSearch = $state(initialIcon);
	let icons: LucideIcon[] = $derived.by(() => {
		const term = iconToSearch.toLowerCase().trim();
		return Object.entries(lucide)
			.filter(([name]) => name.endsWith('Icon'))
			.filter(([name]) => !term || name.toLowerCase().includes(term))
			.map(([name, icon]) => ({ name, icon: icon as typeof IconType }))
			.slice(0, 32);
	});
	const alertProps: AlertProps = {
		title: 'Sin resultados',
		content: 'No encontramos ningún ícono que coincida con tu búsqueda.',
		subcontent: 'Intenta con otro término o revisa la lista completa de iconos.',
		classes: ['bg-gray-50 dark:bg-gray-700']
	};
</script>

<Modal bind:open={isModalOpen} outsideclose={false} onclose={() => onClose()} size="xs">
	<div class="flex flex-col space-y-6">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
			{#if type === 'CREATE'}
				Agrega una categoria
			{:else}
				Editar esta categoria
			{/if}
		</h3>
		<Label class="space-y-2">
			<span>Nombre</span>
			<Input
				type="text"
				name="name"
				placeholder="Punto de basura, lampara caida, señalización faltante, etc"
				autocomplete="off"
				required
				bind:value={categoryName}
			/>
		</Label>
		<Label class="space-y-2">
			<span>Icono</span>
			<Input
				type="text"
				name="icon"
				id="icon"
				placeholder="Buscar icono"
				autocomplete="off"
				required
				clearable
				bind:value={iconToSearch}
			/>
		</Label>
		<Popover
			class="w-110 text-sm font-light "
			triggeredBy="#icon"
			trigger="click"
			placement="bottom"
		>
			{#if icons.length}
				<div class="grid grid-cols-8 gap-2">
					{#each icons as icon (icon.name)}
						{@const Icon = icon.icon}
						<button
							class="flex cursor-pointer justify-center rounded-lg bg-gray-50 p-3 hover:bg-gray-100 dark:bg-gray-700"
							type="button"
							onclick={() => (iconToSearch = icon.name)}
						>
							<Tooltip>{icon.name}</Tooltip>
							<Icon size="24" />
						</button>
					{/each}
				</div>
			{:else}
				<Alert {alertProps} />
			{/if}
		</Popover>
		<div class="flex shrink-0 items-center justify-end space-x-3 rtl:space-x-reverse">
			<Button color="alternative" onclick={() => (isModalOpen = false)}>Cerrar</Button>
			<Button color="emerald" onclick={() => onOperation(categoryName, iconToSearch)}>
				{#if isLoading}
					<Spinner class="me-3" size="4" />
					Cargando...
				{:else if type === 'CREATE'}
					Guardar
				{:else}
					Actualizar
				{/if}
			</Button>
		</div>
	</div>
</Modal>
