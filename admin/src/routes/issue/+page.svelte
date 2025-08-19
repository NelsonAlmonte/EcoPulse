<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
	<table class="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
		<thead class="text-xs uppercase text-gray-700 dark:text-gray-400">
			<tr>
				<th scope="col" class="bg-gray-50 px-6 py-3 dark:bg-gray-800"> Id </th>
				<th scope="col" class="px-6 py-3 dark:bg-gray-800"> Categoria </th>
				<th scope="col" class="bg-gray-50 px-6 py-3"> Reportante </th>
				<th scope="col" class=" px-6 py-3 dark:bg-gray-800"> Estado </th>
				<th scope="col" class="bg-gray-50 px-6 py-3"> Comentario </th>
				<th scope="col" class="px-6 py-3 dark:bg-gray-800"> Fecha </th>
				<th scope="col" class="bg-gray-50 px-6 py-3"> Accciones </th>
			</tr>
		</thead>
		<tbody>
			{#each data.issues as issue}
				<tr class="border-b border-gray-200 dark:border-gray-700">
					<th
						scope="row"
						class="whitespace-nowrap bg-gray-50 px-6 py-4 font-medium text-gray-900 dark:bg-gray-800 dark:text-white"
					>
						{issue.id}
					</th>
					<td class="px-6 py-4"> {issue.category.name} </td>
					<td class="bg-gray-50 px-6 py-4 dark:bg-gray-800">
						{issue.user.name}
						{issue.user.last}
					</td>
					<td class="px-6 py-4"> {issue.status} </td>
					<td class="bg-gray-50 px-6 py-4 dark:bg-gray-800">
						{#if issue.comment}
							{issue.comment.substring(0, 20)}...
						{/if}
					</td>
					<td class="px-6 py-4">
						{new Date(issue.createdAt).toLocaleDateString('es-ES', {
							day: '2-digit',
							month: '2-digit',
							year: 'numeric'
						})}
					</td>
					<td class="bg-gray-50 px-6 py-4 dark:bg-gray-800">
						<Button color="alternative" pill>Ver</Button>
						<Button color="red" pill>Eliminar</Button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
