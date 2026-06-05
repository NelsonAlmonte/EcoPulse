import { error } from '@sveltejs/kit';

export async function parseResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		const body = await response.json();

		error(response.status, body.message ?? 'Error desconocido');
	}

	return response.json() as Promise<T>;
}
