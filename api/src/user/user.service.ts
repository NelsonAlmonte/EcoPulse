import { Injectable } from '@nestjs/common';
import { Issue, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './user.dto';
import { GetIssueDto } from 'src/issue/issue.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getIssues(userId: string): Promise<GetIssueDto[] | null> {
    const issues = await this.prisma.issue.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
        user: true,
        highlights: {
          where: {
            userId,
          },
          select: {
            createdAt: true,
          },
          take: 1,
        },
        _count: {
          select: {
            highlights: true,
          },
        },
      },
      take: 3,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return issues.map((issue) => {
      const transformedIssue = {
        ...issue,
        highlights: issue._count.highlights ? issue._count.highlights : 0,
        hasCurrentUserHighlight: issue.highlights.length ? true : false,
      };

      delete transformedIssue._count;

      return transformedIssue;
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User | null> {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }
}
