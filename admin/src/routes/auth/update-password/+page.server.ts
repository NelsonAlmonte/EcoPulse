import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const newPassword = formData.get('new_password') as string;
		// const oldPassword = formData.get('old_password') as string;

		// const foo = await supabase.auth.updateUser({
		// 	password: newPassword,
		// 	currentPassword: oldPassword
		// });
		const foo = await supabase.auth.updateUser({
			password: newPassword
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
