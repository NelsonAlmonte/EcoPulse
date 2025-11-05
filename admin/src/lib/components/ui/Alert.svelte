<script lang="ts">
	import type { AlertProps } from '$lib/types/ui.type';
	import { Ban } from '@lucide/svelte';

	let { alertProps }: { alertProps: AlertProps } = $props();
	const classes = alertProps.classes.join(' ');
</script>

<div class="flex flex-col items-center justify-center">
	<div
		id="alert-additional-content-2"
		class="{classes} flex flex-col items-center rounded-2xl px-5 py-8 text-center"
		role="alert"
	>
		<div class="mb-2 flex items-center gap-2">
			<Ban size="28" />
			<span class="sr-only">Info</span>
			<h3 class="text-3xl font-bold">{alertProps.title}</h3>
		</div>
		<div class="mt-2 w-3/4">
			<p class="content text-lg font-semibold">
				{alertProps.content}
			</p>
			<p class="mt-3">{alertProps.subcontent}</p>
		</div>
	</div>
</div>

<style>
	.content::first-letter {
		text-transform: capitalize;
	}
</style>
