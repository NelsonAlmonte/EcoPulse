import { Injectable } from '@nestjs/common';
import { Issue, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getIssues(userId: string): Promise<Issue[] | null> {
    return this.prisma.issue.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
        user: true,
      },
      take: 3,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User | null> {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }
}
