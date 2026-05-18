import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		console.log(email);
		const foo = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: 'http://localhost:5173/auth/update-password'
		});
		console.log(foo);
		// if (error) {
		//   console.error(error);
		//   return fail(400, { email, error: 'Hubo un error al iniciar sesión' });
		// } else {
		//   redirect(303, '/admin');
		// }
	}
};
