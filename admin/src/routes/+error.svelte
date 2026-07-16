<script lang="ts">
	import { page } from '$app/state';
	import { OctagonAlert } from '@lucide/svelte';
	import { Button } from 'flowbite-svelte';
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 p-6">
	<div class="w-full max-w-xl">
		<div class="rounded-xl border border-gray-200 bg-white p-8 shadow-md">
			<div class="mb-6 flex justify-center">
				<div class="flex items-center justify-center">
					<span class="text-3xl"><OctagonAlert class="h-14 w-14 text-red-500" /></span>
				</div>
			</div>

			<h1 class="text-center text-3xl font-bold text-gray-900">Ha ocurrido un error</h1>

			<p class="mt-3 text-center text-gray-600">
				No pudimos completar la solicitud. A continuación se muestra el detalle del error.
			</p>

			<div class="mt-8 rounded-2xl border border-gray-200 bg-gray-100 p-4">
				<p class="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">Detalle</p>

				<p class="text-sm wrap-break-word whitespace-pre-wrap text-gray-800">
					{page?.error?.message}
				</p>
			</div>

			<div class="mt-8">
				<Button
					href="/admin"
					class="inline-flex w-full items-center justify-center"
					color="alternative"
					pill
				>
					Volver al inicio
				</Button>
			</div>
		</div>
	</div>
</div>
