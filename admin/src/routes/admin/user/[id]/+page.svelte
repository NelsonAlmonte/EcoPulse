<script lang="ts">
	import type { PageHeader } from '$lib/types/ui.type.js';
	import { pageHeaderState } from '$lib/store/ui.svelte';
	import { issueList } from '$lib/store/issue.svelte';
	import IssueList from '$lib/components/issue/IssueList.svelte';
	import Status from '$lib/components/ui/Status.svelte';

	let { data } = $props();

	const pageHeaderProps: PageHeader = {
		title: 'Detalles del usuario',
		back_url: '/admin/user',
		breadcrumbs: [
			{
				title: 'Inicio',
				url: '/admin'
			},
			{
				title: 'Usuarios',
				url: '/admin/user'
			},
			{
				title: 'Listado',
				url: '/admin/user'
			},
			{
				title: 'Detalles',
				url: '/'
			}
		]
	};

	$effect(() => {
		issueList.list = data.issues;
	});

	Object.assign(pageHeaderState, pageHeaderProps);
</script>

<div class="grid h-[calc(100vh-300px)] grid-cols-2 gap-8">
	<div class="no-scrollbar overflow-y-scroll pb-10">
		<IssueList />
	</div>
	<div>
		<dl>
			<div class="border-b-1 mb-4 border-b-gray-300 pb-2">
				<dt class="mb-2 text-lg font-medium text-gray-900">Nombres</dt>
				<dd class="font-medium capitalize text-gray-500">{data.user.name}</dd>
			</div>
			<div class="border-b-1 mb-4 border-b-gray-300 pb-2">
				<dt class="mb-2 text-lg font-medium text-gray-900">Apellidos</dt>
				<dd class="font-medium capitalize text-gray-500">{data.user.last}</dd>
			</div>
			<div class="border-b-1 mb-4 border-b-gray-300 pb-2">
				<dt class="mb-2 text-lg font-medium text-gray-900">Correo</dt>
				<dd class="font-medium capitalize text-gray-500">{data.user.email}</dd>
			</div>
			<div class="border-b-1 mb-4 border-b-gray-300 pb-2">
				<dt class="mb-2 text-lg font-medium text-gray-900">Rol</dt>
				<dd class="font-medium capitalize text-gray-500">{data.user.role}</dd>
			</div>
			<div class="border-b-1 mb-4 border-b-gray-300 pb-2">
				<dt class="mb-2 text-lg font-medium text-gray-900">Fecha de registro</dt>
				<dd class="font-medium capitalize text-gray-500">
					{new Date(data.user.createdAt).toLocaleDateString('es-ES', {
						day: '2-digit',
						month: '2-digit',
						year: 'numeric'
					})}
				</dd>
			</div>
			<div class="border-b-1 mb-4 border-b-gray-300 pb-2">
				<dt class="mb-2 text-lg font-medium text-gray-900">Reportes</dt>
				<dd class="font-medium capitalize text-gray-500">{data.user.issues}</dd>
			</div>
			<div class="border-b-1 mb-4 border-b-gray-300 pb-2">
				<dt class="mb-2 text-lg font-medium text-gray-900">Estado</dt>
				<dd class="font-medium capitalize text-gray-500">
					{#if data.user.isActive === true}
						<Status status={'activo'} />
					{:else}
						<Status status={'desactivado'} />
					{/if}
				</dd>
			</div>
		</dl>
	</div>
</div>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}

	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
