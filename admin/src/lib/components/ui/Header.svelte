<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Heading } from 'flowbite-svelte';
	import { pageHeaderState } from '$lib/store/ui.svelte';
</script>

<Heading class="mb-6" tag="h3">{pageHeaderState.title}</Heading>
{#if pageHeaderState.breadcrumbs}
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
