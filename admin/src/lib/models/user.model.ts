export interface User {
	id: string;
	name: string;
	last: string;
	email: string;
	createdAt: string;
	role: Role;
	issues: number;
	isActive: boolean;
}

export type Role = 'ADMIN' | 'USER';

export interface Counters {
	issues?: number;
	highlightsGiven?: number;
	highlightsReceived?: number;
}
