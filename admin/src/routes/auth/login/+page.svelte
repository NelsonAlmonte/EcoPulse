<script lang="ts">
	import { Alert, Button, Input, Label } from 'flowbite-svelte';
	import { ShieldX } from '@lucide/svelte';

	let { form } = $props();
</script>

<div class="login-background min-h-screen">
	<header
		class="fixed top-0 flex w-full items-center justify-between bg-transparent p-4 shadow-none"
	>
		<div class="flex items-center">
			<span class="flex items-center space-x-2 text-lg font-bold text-white">
				<img src="/img/logo.png" alt="Flowbite Svelte" class="h-6 w-6 rounded-full" />
				<span>EcoPulse</span>
			</span>
		</div>
	</header>

	<div class="flex h-screen items-center justify-center">
		<div class="mx-4 max-w-lg rounded-2xl bg-white p-8 shadow">
			<div class="py-4">
				<h1 class="mb-4 text-4xl font-bold text-gray-800">
					Bienvenido a <span class="text-emerald-700">EcoPulse</span>
				</h1>
				<span class="mb-4 font-bold text-gray-800"
					>Usa las credenciales asignadas por tu administrador</span
				>
			</div>
			{#if form?.error}
				<Alert class="mb-6" color="red">
					{#snippet icon()}<ShieldX class="h-5 w-5" />{/snippet}
					<span class="font-medium">¡Error al iniciar sesión!</span>
					Verifique sus credenciales y vuelva a intentarlo
				</Alert>
			{/if}
			<form class="space-y-6" method="POST" action="?/login">
				<Label class="space-y-2  text-gray-800">
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

				<Label class="space-y-2  text-gray-800">
					<span>Contraseña</span>
					<Input
						type="password"
						name="password"
						placeholder="Contraseña"
						autocomplete="off"
						required
					/>
				</Label>

				<Button
					type="submit"
					class="w-full py-4 text-base font-medium transition"
					color="emerald"
					pill>Ingresar</Button
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
