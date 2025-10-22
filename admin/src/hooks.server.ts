import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import {
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_PUBLISHABLE_KEY,
	PUBLIC_API_URL
} from '$env/static/public';
import type { User } from '$lib/models/user.model';

const supabase: Handle = async ({ event, resolve }) => {
	/**
	 * Creates a Supabase client specific to this server request.
	 *
	 * The Supabase client gets the Auth token from the request cookies.
	 */
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			/**
			 * SvelteKit's cookies API requires `path` to be explicitly set in
			 * the cookie options. Setting `path` to `/` replicates previous/
			 * standard behavior.
			 */
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
		// auth: {
		// 	// persistSession: true
		// 	// autoRefreshToken: false
		// }
	});

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT validation has failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` and `x-supabase-api-version`
			 * headers, so we need to tell SvelteKit to pass it through.
			 */
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	const publicRoutes = ['/auth/login', '/auth/register', '/auth/error'];
	const currentPath = event.url.pathname;

	if (publicRoutes.includes(currentPath)) {
		return resolve(event);
	}

	if (!session && currentPath.startsWith('/admin')) {
		throw redirect(303, '/auth/login');
	}

	if (session && currentPath === '/auth/login') {
		throw redirect(303, '/admin');
	}

	const res = await event.fetch(new URL(`user/${user.id}`, PUBLIC_API_URL));

	if (!res.ok) {
		console.error('Error al obtener usuario:', res.status);
		throw redirect(303, '/auth/login');
	}

	const userToBeVerified = (await res.json()) as User;

	if (userToBeVerified.role !== 'ADMIN') {
		console.log('Usuario no autorizado');
		throw redirect(303, '/auth/login');
	}

	return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard);
