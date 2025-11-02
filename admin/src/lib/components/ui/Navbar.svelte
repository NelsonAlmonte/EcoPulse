<script>
	import { sidebarState } from '$lib/store/ui.svelte';
	import { userSession } from '$lib/store/userSession.svelte';
	import { Menu, User } from '@lucide/svelte';
	import {
		Navbar,
		NavBrand,
		Dropdown,
		DropdownItem,
		DropdownHeader,
		DropdownGroup,
		SidebarButton,
		Button
	} from 'flowbite-svelte';
</script>

<Navbar class="shadow-sm" navContainerClass="container mx-auto">
	<SidebarButton onclick={() => (sidebarState.canShow = true)} class="mb-2" />
	<div class="flex">
		<Button
			class="p-2! me-4 cursor-pointer"
			size="lg"
			color="light"
			onclick={() => (sidebarState.canShow = true)}
		>
			<Menu class="h-4 w-4 text-gray-950" />
		</Button>
		<NavBrand href="/admin">
			<img src="/img/logo.png" alt="Flowbite Svelte" class="h-6 w-6 rounded-full" />
			<span class="ml-2 self-center whitespace-nowrap text-xl font-semibold dark:text-white"
				>EcoPulse</span
			>
		</NavBrand>
	</div>
	<div class="flex items-center md:order-2">
		<div class="cursor-pointer rounded-full bg-gray-100 p-2" id="avatar-menu">
			<User />
		</div>
	</div>
	<Dropdown placement="bottom" triggeredBy="#avatar-menu">
		<DropdownHeader>
			<span class="block text-sm">{userSession.user?.name} {userSession.user?.last}</span>
			<span class="block truncate text-sm font-medium">{userSession.user?.email}</span>
		</DropdownHeader>
		<DropdownGroup>
			<DropdownItem data-sveltekit-preload-data="off" href="/auth/logout"
				>Cerrar sesión</DropdownItem
			>
		</DropdownGroup>
	</Dropdown>
	<div class="h-12"></div>
</Navbar>
