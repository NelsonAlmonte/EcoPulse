<script lang="ts">
	import type { StatusOption } from '$lib/types/ui.type';
	import { icons } from '$lib/constants/icons.constant';
	import { Badge } from 'flowbite-svelte';

	let { status }: { status: string } = $props();
	const statusOptions: StatusOption[] = [
		{
			label: 'pendiente',
			color: 'amber',
			icon: 'CircleDot'
		},
		{
			label: 'resuelto',
			color: 'emerald',
			icon: 'CircleCheck'
		},
		{
			label: 'descartado',
			color: 'red',
			icon: 'CircleX'
		}
	];
	let currentStatus = $state<StatusOption>(statusOptions[0]);

	$effect(() => {
		currentStatus = statusOptions.find((option) => option.label === status)!;
	});
</script>

<Badge class="rounded-full px-3 py-2 text-sm capitalize" color={currentStatus.color}>
	{#if currentStatus.icon}
		{@const Icon = icons[currentStatus.icon]}
		<Icon size="18" class="me-2" />
	{/if}
	{currentStatus.label}
</Badge>
