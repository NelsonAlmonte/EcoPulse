<script lang="ts">
	import {
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarDropdownWrapper,
		SidebarButton,
		uiHelpers
	} from 'flowbite-svelte';
	import { ChartArea, FileSearch, House, Settings, Users } from '@lucide/svelte';
	import { page } from '$app/state';

	let activeUrl = $state(page.url.pathname);
	const spanClass = 'flex-1 ms-3 whitespace-nowrap';
	const demoSidebarUi = uiHelpers();
	let isDemoOpen = $state(false);
	const closeDemoSidebar = demoSidebarUi.close;
	$effect(() => {
		isDemoOpen = demoSidebarUi.isOpen;
		activeUrl = page.url.pathname;
	});
</script>

<SidebarButton onclick={demoSidebarUi.toggle} class="mb-2" />
<div>
	<Sidebar
		{activeUrl}
		backdrop={false}
		isOpen={isDemoOpen}
		closeSidebar={closeDemoSidebar}
		params={{ x: -50, duration: 50 }}
		position="absolute"
		classes={{ nonactive: 'p-2', active: 'p-2' }}
		class="z-50 mt-[70px] h-full"
	>
		<SidebarGroup>
			<SidebarItem label="Inicio">
				{#snippet icon()}
					<House
						class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
					/>
				{/snippet}
			</SidebarItem>
			<SidebarDropdownWrapper label="Incidencias" classes={{ btn: 'p-2' }}>
				{#snippet icon()}
					<FileSearch
						class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
					/>
				{/snippet}
				<SidebarItem label="Listado" href="/issue" />
			</SidebarDropdownWrapper>
			<SidebarDropdownWrapper label="Usuarios" classes={{ btn: 'p-2' }}>
				{#snippet icon()}
					<Users
						class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
					/>
				{/snippet}
				<SidebarItem label="Analítica" href="/" />
			</SidebarDropdownWrapper>
			<SidebarItem label="Analítica" {spanClass} href="/components/sidebar">
				{#snippet icon()}
					<ChartArea
						class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
					/>
				{/snippet}
			</SidebarItem>
		</SidebarGroup>
		<SidebarGroup border>
			<SidebarDropdownWrapper label="Setting" classes={{ btn: 'p-2' }}>
				{#snippet icon()}
					<Settings
						class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
					/>
				{/snippet}
				<SidebarItem label="Account" href="" />
			</SidebarDropdownWrapper>
		</SidebarGroup>
	</Sidebar>
</div>
