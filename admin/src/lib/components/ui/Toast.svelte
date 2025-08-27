<script lang="ts">
	import { icons } from '$lib/constants/icons';
	import { Toast } from 'flowbite-svelte';
	import { toastState } from '$lib/store/ui.svelte';
</script>

{#if toastState.toastStatus}
	<Toast color={toastState.toast.color} position="bottom-right" dismissable={false}>
		{#snippet icon()}
			{#if toastState.toast.icon}
				{@const Icon = icons[toastState.toast.icon]}
				<Icon size="20" />
			{/if}
			<span class="sr-only">Check icon</span>
		{/snippet}
		{toastState.toast.content}
	</Toast>
{/if}
