import type { LayoutServerLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import type { User } from '$lib/models/user.model';

export const load: LayoutServerLoad = async ({ fetch, locals: { safeGetSession }, cookies }) => {
	const { session } = await safeGetSession();
	let loggedUser = {} as User;

	if (session) {
		const userResponse = await fetch(new URL(`user/${session.user.id}`, PUBLIC_API_URL));

		if (!userResponse.ok) {
			console.error('Error al obtener usuario:', userResponse.status);
		}

		loggedUser = (await userResponse.json()) as User;
	}

	return {
		session,
		cookies: cookies.getAll(),
		loggedUser
	};
};
