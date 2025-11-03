<script lang="ts">
	import type { InsightProps } from '$lib/types/ui.type';
	import { icons } from '$lib/constants/icons.constant';
	import { Heading } from 'flowbite-svelte';

	let { insightProps }: { insightProps: InsightProps } = $props();
</script>

<div class="rounded-xl px-8 py-6 shadow">
	<div class="flex items-center justify-start">
		{#if insightProps.icon}
			{@const Icon = icons[insightProps.icon]}
			<Icon class="text-emerald-600" size="30" />
		{/if}
		<div class="ms-6">
			<Heading class="text-gray-900" tag="h4">{insightProps.value}</Heading>
			<span class=" text-gray-600">{insightProps.label}</span>
		</div>
	</div>
</div>
