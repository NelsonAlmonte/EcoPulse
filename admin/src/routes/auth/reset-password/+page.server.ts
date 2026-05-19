import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { RESET_PASSWORD_URL } from '$env/static/private';

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: RESET_PASSWORD_URL
		});

		if (error) {
			return fail(500, {
				email,
				alert: {
					message:
						'Ocurrio un error al enviar esta solicitud. Verifique que el correo exista o intentelo de nuevo mas tarde',
					color: 'red'
				}
			});
		}

		return {
			email,
			alert: {
				message:
					'Solicitud enviada exitosamente. Por favor verifique su correo y siga las instrucciones.',
				color: 'emerald'
			}
		};
	}
} satisfies Actions;
