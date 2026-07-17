import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;

		const redirectUrl = new URL('/auth/update-password', url.origin);

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: redirectUrl.toString()
		});

		if (error) {
			return fail(500, {
				email,
				alert: {
					message:
						'Ocurrió un error al enviar esta solicitud. Verifique que el correo exista o inténtelo de nuevo más tarde',
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
