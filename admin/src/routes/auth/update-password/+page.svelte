<script lang="ts">
	import type { FlowbiteColor } from '$lib/types/ui.type.js';
	import { ShieldAlert } from '@lucide/svelte';
	import { Alert, Button, Helper, Input, Label } from 'flowbite-svelte';

	let { form } = $props();
	let newPassword = $state('');
	let confirmPassword = $state('');
	let canResetPassword = $state(false);
	let messages = $state({
		new_password: {
			message: 'Debe tener al menos 8 caracteres.',
			color: 'default'
		},
		confirm_password: {
			message: '',
			color: 'default'
		}
	});
</script>

<div class="login-background min-h-screen">
	<div class="flex h-screen items-center justify-center">
		<div class="mx-4 max-w-lg rounded-2xl bg-white p-8 shadow">
			<div class="py-4">
				<h1 class="mb-4 text-4xl font-bold text-gray-800">
					Elige tu nueva <span class="text-emerald-700">contraseña</span>
				</h1>
				<span class="mb-4 font-bold text-gray-800">Introduce tu nueva contraseña</span>
			</div>
			{#if form?.alert}
				<Alert class="mb-6" color={form.alert.color as FlowbiteColor}>
					{#snippet icon()}<ShieldAlert class="h-5 w-5" />{/snippet}
					{form.alert.message}
				</Alert>
			{/if}
			<form class="space-y-6" method="POST">
				<Label class="space-y-2" color={messages.new_password.color as FlowbiteColor}>
					<span>Nueva contraseña</span>
					<Input
						type="password"
						name="new_password"
						placeholder="Nueva contraseña"
						autocomplete="off"
						color={messages.new_password.color as FlowbiteColor}
						bind:value={newPassword}
						onblur={() => {
							if (newPassword.length >= 8) {
								messages.new_password.color = 'emerald';
								messages.new_password.message = 'Contraseña aceptada.';
							} else {
								messages.new_password.color = 'red';
								messages.new_password.message = 'La contraseña debe tener al menos 8 caracteres.';
							}
						}}
						required
					/>
					<Helper class="mt-2" color={messages.new_password.color as FlowbiteColor}
						>{messages.new_password.message}</Helper
					>
				</Label>

				<Label class="space-y-2" color={messages.confirm_password.color as FlowbiteColor}>
					<span>Confirmar contraseña</span>
					<Input
						type="password"
						name="confirm_password"
						placeholder="Confirmar contraseña"
						autocomplete="off"
						color={messages.confirm_password.color as FlowbiteColor}
						bind:value={confirmPassword}
						onblur={() => {
							if (confirmPassword === newPassword && newPassword.length >= 8) {
								messages.confirm_password.color = 'emerald';
								messages.confirm_password.message = 'Contraseña confirmada.';
								canResetPassword = true;
							} else {
								messages.confirm_password.color = 'red';
								messages.confirm_password.message = 'Las contraseñas deben ser iguales.';
								canResetPassword = false;
							}
						}}
						required
					/>
					<Helper class="mt-2" color={messages.confirm_password.color as FlowbiteColor}
						>{messages.confirm_password.message}</Helper
					>
				</Label>

				<Button
					type="submit"
					class="w-full py-4 text-base font-medium transition"
					color="emerald"
					disabled={!canResetPassword}
					pill>Confirmar contraseña</Button
				>
			</form>
		</div>
	</div>
</div>

<style>
	.login-background {
		background-image: url('/img/login-bg.jpg');
		background-size: cover;
		background-position: center;
	}
</style>
