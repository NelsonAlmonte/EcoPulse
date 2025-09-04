<script lang="ts">
	import type { Issue } from '$lib/models/issue.model';
	import IssueItem from './IssueItem.svelte';
	import { Popover } from 'flowbite-svelte';
	import { Star } from '@lucide/svelte';

	let { issue }: { issue: Issue } = $props();
</script>

<button
	class="hover:scale-115 inline-flex cursor-pointer items-center rounded-lg bg-white px-4 py-1.5 shadow-lg transition ease-in-out"
>
	<Star size="18" class="fill-emerald-800 stroke-emerald-800" />
	<span class="ms-0.5 text-sm font-bold text-gray-900">{issue.highlights}</span>
</button>
<Popover class="w-80 rounded-xl bg-white" classes={{ content: 'p-0' }}>
	<div class="marker">
		<IssueItem {issue} />
	</div>
</Popover>

<style>
	.marker :global(img) {
		height: 240px !important;
	}
</style>
