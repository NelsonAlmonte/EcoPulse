<script lang="ts">
	import type { PageProps } from './$types';
	import type { FlowbiteColor } from '$lib/types/ui.type';
	import { ShieldAlert } from '@lucide/svelte';
	import { Alert, Button, Input, Label } from 'flowbite-svelte';

	let { form }: PageProps = $props();
</script>

<div class="login-background min-h-screen">
	<div class="flex h-screen items-center justify-center">
		<div class="mx-4 max-w-lg rounded-2xl bg-white p-8 shadow">
			<div class="py-4">
				<h1 class="mb-4 text-4xl font-bold text-gray-800">
					Olvide mi <span class="text-emerald-700">contraseña</span>
				</h1>
				<span class="mb-4 font-bold text-gray-800"
					>Introduce el correo electrónico con el que usualmente inicias sesión</span
				>
			</div>
			{#if form?.alert}
				<Alert class="mb-6" color={form.alert.color as FlowbiteColor}>
					{#snippet icon()}<ShieldAlert class="h-5 w-5" />{/snippet}
					{form.alert.message}
				</Alert>
			{/if}
			<form class="space-y-6" method="POST">
				<Label class="space-y-2">
					<span>Correo</span>
					<Input
						type="email"
						name="email"
						placeholder="Correo"
						autocomplete="off"
						value={form?.email ?? ''}
						required
					/>
				</Label>

				<Button
					type="submit"
					class="w-full py-4 text-base font-medium transition"
					color="emerald"
					pill>Restablecer contraseña</Button
				>
			</form>
		</div>
	</div>
</div>

<style>
	.login-background {
		background-image: url('/img/foo.jpg');
		background-size: cover;
		background-position: center;
	}
</style>
