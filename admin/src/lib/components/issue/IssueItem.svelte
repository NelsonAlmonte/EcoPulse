<script lang="ts">
	import type { Issue } from '$lib/models/issue.model';
	import Status from '$lib/components/ui/Status.svelte';
	import { relativeTime } from '$lib/utils/relativeTime';
	import { Star } from '@lucide/svelte';

	let { issue }: { issue: Issue } = $props();
</script>

<div class="relative">
	<img src={issue.photo} class="h-90 w-full rounded-xl object-cover" alt={issue.category.name} />
	<div class="absolute top-0 m-2">
		<Status status={issue.status.toLocaleLowerCase()} />
	</div>
	<div class="absolute bottom-0 w-full">
		<div class="m-2 rounded-xl bg-white px-6 py-4">
			<div class="flex items-center justify-between">
				<div>
					<a
						href="/issue/{issue.id}"
						class="text-base font-bold text-gray-900 hover:underline dark:text-white"
						target="_blank"
					>
						{issue.category.name}
					</a>
					<p class="mt-2 text-sm font-normal leading-tight text-gray-700 dark:text-gray-400">
						{issue.user.name}
						{issue.user.last} • {relativeTime(issue.createdAt).split('hace ')[1]}
					</p>
				</div>
				<div class="inline-flex items-center">
					<Star size="24" class="fill-emerald-800 stroke-emerald-800" />
					<span class="ms-0.5 text-sm font-bold">{issue.highlights}</span>
				</div>
			</div>
		</div>
	</div>
</div>
