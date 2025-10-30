import type { User } from '$lib/models/user.model';

class UserSession {
	#user = $state<User | null>(null);

	get user() {
		return this.#user;
	}

	set user(value: User | null) {
		this.#user = value;
	}

	clear() {
		this.#user = null;
	}
}

export const userSession = new UserSession();
