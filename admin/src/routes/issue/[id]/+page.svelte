<script lang="ts">
	import type { PageHeader } from '$lib/types/ui.type.js';
	import { pageHeaderState } from '$lib/store/ui.svelte.js';
	import { Button, Dropdown, DropdownItem, Heading, Modal } from 'flowbite-svelte';
	import Map from '$lib/components/issue/Map.svelte';
	import Status from '$lib/components/ui/Status.svelte';
	import { relativeTime } from '$lib/utils/relativeTime.js';
	import { ChevronRight, EllipsisVertical, Maximize } from '@lucide/svelte';

	let { data } = $props();
	const pageHeaderProps: PageHeader = {
		title: 'Detalles de la incidencia',
		breadcrumbs: [
			{
				title: 'Inicio',
				url: '/'
			},
			{
				title: 'Incidencias',
				url: '/issue'
			},
			{
				title: 'Listado',
				url: '/issue'
			},
			{
				title: 'Detalle',
				url: '/'
			}
		]
	};
	let isModalOpen = $state(false);

	Object.assign(pageHeaderState, pageHeaderProps);
</script>

<div class="mb-4">
	<div class="flex items-center justify-between">
		<div>
			<Heading tag="h2" class="text-gray-900">{data.issue.category.name}</Heading>
			<div class="flex items-center space-x-1">
				<Status status={data.issue.status.toLocaleLowerCase()} />
				<span class="text-gray-700">
					reportado {relativeTime(data.issue.createdAt)} por
					<span class="font-medium text-gray-900 hover:underline">
						{data.issue.user.name}
						{data.issue.user.last}
					</span>
				</span>
			</div>
		</div>
		<div>
			<Button class="p-2! cursor-pointer" size="lg" color="light">
				<EllipsisVertical size="20" />
			</Button>
			<Dropdown simple class="cursor-pointer px-2 font-medium">
				<DropdownItem class="flex items-center rounded-lg text-base">
					<span> Cambiar estado </span>
					<ChevronRight size="20" class="ms-2 text-gray-900  dark:text-white" />
				</DropdownItem>
				<Dropdown simple placement="right-start" class="px-2">
					<DropdownItem class="rounded-lg text-base">Pendiente</DropdownItem>
					<DropdownItem class="rounded-lg text-base">Resuelto</DropdownItem>
					<DropdownItem class="rounded-lg text-base">Descartado</DropdownItem>
				</Dropdown>
				<DropdownItem class="rounded-lg text-base hover:bg-red-100 hover:text-red-700"
					>Eliminar</DropdownItem
				>
			</Dropdown>
		</div>
	</div>
</div>
<div class="flex space-x-8">
	<div class="relative">
		<img class="w-100 h-150 rounded-xl object-cover" src={data.issue.photo} alt="Foto" />
		<Button class="p-2! absolute end-0 top-0 m-4 cursor-pointer" size="lg" color="light">
			<Maximize size="20" onclick={() => (isModalOpen = true)} />
		</Button>
	</div>
	<div class="flex-1">
		<div class="flex justify-between space-x-8">
			<Map latitude={Number(data.issue.latitude)} longitude={Number(data.issue.longitude)} />
			<div class="flex-1">
				<dl>
					{#each data.issueInfoItems as item}
						{#if item.value !== ''}
							<div class="border-b-1 mb-4 border-b-gray-300 pb-2">
								<dt class="mb-2 text-lg font-medium text-gray-900">{item.label}</dt>
								<dd class="font-medium capitalize text-gray-500">{item.value}</dd>
							</div>
						{/if}
					{/each}
				</dl>
			</div>
		</div>
	</div>
</div>

<Modal title="Foto de la incidencia" form bind:open={isModalOpen}>
	<img class="h-full w-full rounded-xl" src={data.issue.photo} alt="Foto" />
</Modal>
