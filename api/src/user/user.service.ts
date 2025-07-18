import { Injectable } from '@nestjs/common';
import { Issue } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

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
    });
  }
}
