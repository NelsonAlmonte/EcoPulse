import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const newPassword = formData.get('new_password') as string;
		const { error } = await supabase.auth.updateUser({
			password: newPassword
		});

		if (error) {
			console.error(error);
			return fail(400, {
				new_password: '',
				alert: {
					message: 'Ocurrio un error al enviar esta solicitud. Intentelo de nuevo mas tarde.',
					color: 'red'
				}
			});
		}

		return {
			new_password: '',
			alert: {
				message: 'Contraseña actualizada exitosamente. Puede iniciar sesión en la aplicación.',
				color: 'emerald'
			}
		};
	}
};
