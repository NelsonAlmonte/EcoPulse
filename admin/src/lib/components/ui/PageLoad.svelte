<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	const progress = new Tween(0, {
		duration: 3500,
		easing: cubicOut
	});
	let isLoading = $state(false);

	beforeNavigate(() => {
		progress.set(0.7);
		isLoading = true;
	});

	afterNavigate(async () => {
		await progress.set(1, { duration: 1000 });
		progress.set(0);
		isLoading = false;
	});
</script>

{#if isLoading}
	<div out:fade={{ delay: 250 }}>
		<div class="fixed inset-0 z-20 h-1">
			<div
				class="progress-sliver h-full animate-pulse bg-emerald-700"
				style={`--width: ${progress.current * 100}%`}
			></div>
		</div>
	</div>
{/if}

<style>
	.progress-sliver {
		width: var(--width);
	}
</style>
