import { User } from '@prisma/client';

export interface LogInUserDto {
  email: string;
  password: string;
}

export interface SignupUserDto {
  name: string;
  last: string;
  email: string;
  password: string;
}

export type ValidatedUser = Pick<
  User,
  'id' | 'name' | 'last' | 'email' | 'role' | 'createdAt'
>;

export interface AuthResponseDto {
  id: string;
  email: string;
  token: string;
}
