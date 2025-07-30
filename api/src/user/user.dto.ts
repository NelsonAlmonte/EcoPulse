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
  name: string;
  last: string;
  email: string;
  createdAt: Date;
}
