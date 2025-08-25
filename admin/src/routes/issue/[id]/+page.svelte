<script lang="ts">
	import type { PageHeader } from '$lib/types/ui.type.js';
	import { pageHeaderState } from '$lib/store/ui.svelte.js';
	import { Tabs, TabItem } from 'flowbite-svelte';
	import Map from '$lib/components/issue/Map.svelte';
	import { Info, MapIcon } from '@lucide/svelte';

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

	Object.assign(pageHeaderState, pageHeaderProps);
</script>

<div class="mb-4 flex space-x-12">
	<img class="w-150 rounded-xl" src={data.issue.photo} alt="Foto" />
	<div class="flex-1 rounded-xl bg-gray-50 p-4 shadow">
		<Tabs tabStyle="underline">
			<TabItem open>
				{#snippet titleSlot()}
					<div class="flex items-center gap-2">
						<Info size="20" />
						Detalle
					</div>
				{/snippet}
				<dl>
					{#each data.issueInfoItems as item}
						{#if item.value !== ''}
							<div class="mb-4">
								<dt class="text-lg font-medium text-gray-900">{item.label}</dt>
								<dd class="font-medium capitalize text-gray-500">{item.value}</dd>
							</div>
						{/if}
					{/each}
				</dl>
			</TabItem>
			<TabItem>
				{#snippet titleSlot()}
					<div class="flex items-center gap-2">
						<MapIcon size="20" />
						Mapa
					</div>
				{/snippet}
				<div>
					<Map latitude={Number(data.issue.latitude)} longitude={Number(data.issue.longitude)} />
				</div>
			</TabItem>
		</Tabs>
	</div>
</div>
