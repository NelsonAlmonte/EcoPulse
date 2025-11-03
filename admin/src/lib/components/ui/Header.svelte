<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Button, Heading } from 'flowbite-svelte';
	import { pageHeaderState } from '$lib/store/ui.svelte';
	import { ArrowLeft } from '@lucide/svelte';
</script>

<div>
	<div class="mb-6 flex items-center">
		{#if pageHeaderState.back_url}
			<Button
				href={pageHeaderState.back_url}
				class="p-2! me-3 cursor-pointer"
				size="lg"
				color="light"
			>
				<ArrowLeft size="16" />
			</Button>
		{/if}
		<Heading tag="h3">{pageHeaderState.title}</Heading>
	</div>
	{#if pageHeaderState.breadcrumbs && pageHeaderState.breadcrumbs?.length > 0}
		<Breadcrumb class="mb-8" aria-label="Default breadcrumb example">
			{#each pageHeaderState.breadcrumbs as breadcrumb, index}
				{#if index === 0}
					<BreadcrumbItem href={breadcrumb.url} home>{breadcrumb.title}</BreadcrumbItem>
				{:else if pageHeaderState.breadcrumbs.length - 1 === index}
					<BreadcrumbItem>{breadcrumb.title}</BreadcrumbItem>
				{:else}
					<BreadcrumbItem href={breadcrumb.url}>{breadcrumb.title}</BreadcrumbItem>
				{/if}
			{/each}
		</Breadcrumb>
	{/if}
</div>
