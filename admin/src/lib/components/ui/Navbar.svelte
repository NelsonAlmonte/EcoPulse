<script>
	import { sidebarState } from '$lib/store/ui.svelte';
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

<Navbar class="shadow-sm" navContainerClass="mx-0">
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
		<NavBrand href="/">
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
			<span class="block text-sm">Bonnie Green</span>
			<span class="block truncate text-sm font-medium">name@flowbite.com</span>
		</DropdownHeader>
		<DropdownGroup>
			<DropdownItem>Dashboard</DropdownItem>
			<DropdownItem>Settings</DropdownItem>
			<DropdownItem>Earnings</DropdownItem>
		</DropdownGroup>
		<DropdownHeader>Sign out</DropdownHeader>
	</Dropdown>
	<div class="h-12"></div>
</Navbar>
