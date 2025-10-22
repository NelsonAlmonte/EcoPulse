<script lang="ts">
	import {
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarDropdownWrapper,
		Drawer,
		SidebarWrapper,
		Button,
		NavBrand
	} from 'flowbite-svelte';
	import { ChartArea, FileSearch, House, Settings, Users, XIcon } from '@lucide/svelte';
	import { page } from '$app/state';
	import { sidebarState } from '$lib/store/ui.svelte';

	let activeUrl = $state(page.url.pathname);
	const spanClass = 'flex-1 ms-3 whitespace-nowrap';
	$effect(() => {
		activeUrl = page.url.pathname;
	});
</script>

<Drawer bind:open={sidebarState.canShow} class="w-64 bg-gray-50 p-0 dark:bg-gray-800">
	<div class="flex justify-between px-6 py-4">
		<NavBrand href="/">
			<img src="/img/logo.png" alt="Flowbite Svelte" class="h-6 w-6 rounded-full" />
			<span class="ml-2 self-center whitespace-nowrap text-xl font-semibold dark:text-white"
				>EcoPulse</span
			>
		</NavBrand>
		<Button
			class="p-2! cursor-pointer"
			size="lg"
			color="light"
			onclick={() => (sidebarState.canShow = false)}
		>
			<XIcon class="h-4 w-4 text-gray-950" />
		</Button>
	</div>
	<Sidebar disableBreakpoints={true} class="top-16" {activeUrl}>
		<SidebarWrapper class="overflow-y-auto rounded-sm px-3 py-0 dark:bg-gray-800">
			<SidebarGroup>
				<SidebarItem label="Inicio" href="/admin">
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
					<SidebarItem label="Listado" href="/admin/issue" />
					<SidebarItem label="Mapa" href="/admin/issue/map" />
				</SidebarDropdownWrapper>
				<SidebarDropdownWrapper label="Usuarios" classes={{ btn: 'p-2' }}>
					{#snippet icon()}
						<Users
							class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					{/snippet}
					<SidebarItem label="Listado" href="/admin/user" />
				</SidebarDropdownWrapper>
				<SidebarDropdownWrapper label="Estadísticas" classes={{ btn: 'p-2' }}>
					{#snippet icon()}
						<ChartArea
							class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					{/snippet}
					<SidebarItem label="Mapa de calor" href="/admin/statistic/heatmap" />
					<SidebarItem label="Reportes" href="/admin/statistic" />
					<SidebarItem label="Mapa analítico" href="/admin/statistic/map-analytics" />
				</SidebarDropdownWrapper>
			</SidebarGroup>
			<SidebarGroup border>
				<SidebarDropdownWrapper label="Configuración" classes={{ btn: 'p-2' }}>
					{#snippet icon()}
						<Settings
							class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					{/snippet}
					<SidebarItem label="Categorias" href="/admin/category" />
				</SidebarDropdownWrapper>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
</Drawer>
