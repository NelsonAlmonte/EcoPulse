<script lang="ts">
	import type { PageHeader } from '$lib/types/ui.type.js';
	import { afterNavigate, goto } from '$app/navigation';
	import { pageHeaderState } from '$lib/store/ui.svelte';
	import { userList } from '$lib/store/user.svelte';
	import { Button, Heading, PaginationNav } from 'flowbite-svelte';
	import DeleteButton from '$lib/components/ui/DeleteButton.svelte';

	let { data } = $props();
	let isLoading = $state(false);
	let currentPage = $derived(Number(data.pagination.page));
	let currentAmount = $derived(Number(data.pagination.amount));
	let totalPages = $derived(Math.ceil(data.users.pagination.total / data.users.pagination.amount));
	const pageHeaderProps: PageHeader = {
		title: 'Listado de usuarios',
		back_url: '/',
		breadcrumbs: [
			{
				title: 'Inicio',
				url: '/'
			},
			{
				title: 'Usuarios',
				url: '/user'
			},
			{
				title: 'Listado',
				url: '/user'
			}
		]
	};

	function handlePageChange(page: number) {
		currentPage = page;
		isLoading = true;

		const newUrl = new URL(window.location.href);

		newUrl.searchParams.set('page', currentPage.toString());
		newUrl.searchParams.set('amount', data.users.pagination.amount.toString() ?? '5');

		goto(newUrl);
	}

	afterNavigate(() => {
		isLoading = false;
		userList.list = data.users;
	});

	userList.list = data.users;

	Object.assign(pageHeaderState, pageHeaderProps);
</script>

<div class="mb-4 flex items-center justify-between">
	<Heading tag="h6">{userList.list.pagination.total} usuarios</Heading>
</div>
<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
	<table class="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
		<thead class="text-xs uppercase text-gray-700 dark:text-gray-400">
			<tr>
				<th scope="col" class="bg-gray-50 px-6 py-3 dark:bg-gray-800"> Id </th>
				<th scope="col" class="px-6 py-3 dark:bg-gray-800"> Nombres </th>
				<th scope="col" class="bg-gray-50 px-6 py-3"> Apellidos </th>
				<th scope="col" class="px-6 py-3 dark:bg-gray-800"> Correo </th>
				<th scope="col" class="bg-gray-50 px-6 py-3"> Rol </th>
				<th scope="col" class="px-6 py-3 dark:bg-gray-800"> Fecha de registro </th>
				<th scope="col" class="bg-gray-50 px-6 py-3"> Reportes </th>
				<th scope="col" class="px-6 py-3 dark:bg-gray-800"> Accciones </th>
			</tr>
		</thead>
		<tbody>
			{#if !isLoading}
				{#each userList.list.data as user (user.id)}
					<tr class="border-b border-gray-200 dark:border-gray-700">
						<th
							scope="row"
							class="whitespace-nowrap bg-gray-50 px-6 py-4 font-medium text-gray-900 dark:bg-gray-800 dark:text-white"
						>
							{user.id}
						</th>
						<td class="px-6 py-4"> {user.name} </td>
						<td class="bg-gray-50 px-6 py-4 dark:bg-gray-800">
							{user.last}
						</td>
						<td class="px-6 py-4"> {user.email} </td>
						<td class="bg-gray-50 px-6 py-4 dark:bg-gray-800"> {user.role} </td>
						<td class=" px-6 py-4">
							{new Date(user.createdAt).toLocaleDateString('es-ES', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric'
							})}
						</td>
						<td class="bg-gray-50 px-6 py-4 dark:bg-gray-800"> {user.issues} </td>
						<td class="flex gap-x-2 px-6 py-4">
							<Button href="user/{user.id}?all=1" color="alternative" pill>Ver</Button>
							<DeleteButton
								endpoint={'user'}
								id={user.id}
								onDeleted={() => userList.refresh(currentPage.toString(), currentAmount.toString())}
							>
								<Button color="red" pill>Eliminar</Button>
							</DeleteButton>
						</td>
					</tr>
				{/each}
			{:else}
				{#each { length: 5 }}
					<tr class="border-b border-gray-200 dark:border-gray-700">
						{#each { length: 7 }}
							<td class="px-6 py-4">
								<div role="status" class="max-w-sm animate-pulse">
									<div class="mb-4 h-2.5 w-36 rounded-full bg-gray-200 dark:bg-gray-700"></div>
									<span class="sr-only">Loading...</span>
								</div>
							</td>
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>

<div class="mt-4 flex items-center justify-center">
	<PaginationNav {currentPage} {totalPages} onPageChange={handlePageChange} size="large" />
</div>
