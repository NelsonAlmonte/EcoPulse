<script lang="ts">
	import { SlidersHorizontal } from '@lucide/svelte';
	import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';

	let isModalOpen = $state(true);
</script>

<Button onclick={() => (isModalOpen = true)} color="alternative" pill>
	<SlidersHorizontal class="me-2" size="20" />
	Filtros
</Button>

<Modal form bind:open={isModalOpen} size="xs">
	<div class="flex flex-col space-y-6">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Filtros</h3>
		<p class="mb-4 font-semibold text-gray-900 dark:text-white">Estado</p>
		<ul
			class="w-full items-center divide-x divide-gray-200 rounded-lg border border-gray-200 sm:flex rtl:divide-x-reverse dark:divide-gray-600 dark:border-gray-600 dark:bg-gray-800"
		>
			<li class="w-full"><Checkbox classes={{ div: 'p-3' }}>Pendiente</Checkbox></li>
			<li class="w-full"><Checkbox classes={{ div: 'p-3' }}>Resuelto</Checkbox></li>
			<li class="w-full"><Checkbox classes={{ div: 'p-3' }}>Descartado</Checkbox></li>
		</ul>
	</div>
</Modal>
