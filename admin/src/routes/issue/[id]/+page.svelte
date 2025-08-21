<script lang="ts">
	import { icons } from '$lib/constants/icons';

	let { data } = $props();

	console.log(data);
</script>

<div class="flex space-x-4">
	<img class="w-150 rounded-2xl" src={data.issue.photo} alt="Foto" />
	<div class="flex-1">
		<h1 class="text-4xl text-gray-900">{data.issue.category.name}</h1>
		<div class="mt-4 grid grid-cols-3 gap-4">
			{#each data.issueInfoItems as item}
				<div
					class="flex items-center justify-start gap-3 rounded-2xl bg-gray-100 p-4 capitalize text-gray-700 dark:bg-gray-600 dark:text-gray-500"
				>
					<div class="ms-3">
						{#if item.icon}
							{@const Icon = icons[item.icon]}
							<Icon size="20" />
						{/if}
					</div>
					<div class="flex flex-col">
						<span class="font-bold">{item.label}</span>
						<span class="text-sm">{item.value}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
