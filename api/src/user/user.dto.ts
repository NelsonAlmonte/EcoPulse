import { Role } from '@prisma/client';

export interface CreateUserDto {
  id: string;
  name: string;
  last: string;
  email: string;
  password: string;
  role: Role;
}

export interface GetUserDto {
  id: string;
  name: string;
  last: string;
  email: string;
  createdAt: Date;
  issues?: number;
}

export interface UpdateUserDto {
  name: string;
  last: string;
}
