<script lang="ts">
	import { Card, Heading } from 'flowbite-svelte';
</script>

<Heading class="mb-4" tag="h6">100 incidencias</Heading>
<div class="grid grid-cols-2 gap-4">
	{#each { length: 4 }}
		<Card img="https://flowbite-svelte.com/images/image-1.webp">
			<div class="m-6">
				<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					Noteworthy technology acquisitions 2021
				</h5>
				<p class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400">
					Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse
					chronological order.
				</p>
			</div>
		</Card>
	{/each}
</div>
