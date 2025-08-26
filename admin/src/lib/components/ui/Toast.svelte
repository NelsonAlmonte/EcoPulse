<script lang="ts">
	import { icons } from '$lib/constants/icons';
	import { Toast } from 'flowbite-svelte';
	import { toastState } from '$lib/store/ui.svelte';
</script>

<Toast color="green" position="bottom-right">
	{#snippet icon()}
		{#if toastState.icon}
			{@const Icon = icons[toastState.icon]}
			<Icon size="20" />
		{/if}
		<span class="sr-only">Check icon</span>
	{/snippet}
	{toastState.content}
</Toast>
