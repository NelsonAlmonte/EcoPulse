import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, GetUserDto, UpdateUserDto } from './user.dto';
import { GetIssueDto } from 'src/issue/issue.dto';
import { PaginationParams } from 'src/util/interfaces/response.params';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsersList(
    pagination: PaginationParams,
  ): Promise<GetUserDto[] | null> {
    const users = await this.prisma.user.findMany({
      include: {
        _count: {
          select: {
            issues: true,
          },
        },
      },
      skip: pagination.skip,
      take: pagination.take,
    });

    return users.map((user) => {
      const transformedUser = {
        ...user,
        issues: user._count.issues ? user._count.issues : 0,
      };

      delete transformedUser._count;

      return transformedUser;
    });
  }

  async getIssues(
    userId: string,
    pagination: PaginationParams,
    where: Prisma.IssueWhereInput,
    order: Prisma.IssueOrderByWithRelationInput,
  ): Promise<GetIssueDto[] | null> {
    const issues = await this.prisma.issue.findMany({
      skip: pagination.skip,
      take: pagination.take,
      where,
      include: {
        category: true,
        user: {
          omit: {
            password: true,
            role: true,
          },
        },
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
      orderBy: order,
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

  async getHighlightsGiven(
    userId: string,
    pagination: PaginationParams,
  ): Promise<GetIssueDto[] | null> {
    const highlights = await this.prisma.highlight.findMany({
      where: {
        userId,
      },
      include: {
        issue: {
          include: {
            category: true,
            user: {
              omit: {
                password: true,
                role: true,
              },
            },
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
        },
      },
      skip: pagination.skip,
      take: pagination.take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return highlights.map((highlight) => {
      const transformedHighlight = {
        ...highlight.issue,
        highlights: highlight.issue._count.highlights
          ? highlight.issue._count.highlights
          : 0,
        hasCurrentUserHighlight: highlight.issue.highlights.length
          ? true
          : false,
      };

      delete transformedHighlight._count;

      return transformedHighlight;
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User | null> {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async getUser(id: string): Promise<GetUserDto | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            issues: true,
          },
        },
      },
    });

    const transformedUser = {
      ...user,
      issues: user._count.issues ? user._count.issues : 0,
    };

    delete transformedUser._count;

    return transformedUser;
  }

  updateUser(updateUserDto: UpdateUserDto, id: string): Promise<GetUserDto> {
    return this.prisma.user.update({
      data: updateUserDto,
      where: {
        id,
      },
      omit: {
        password: true,
        role: true,
      },
    });
  }

  countUserIssues(userId: string): Promise<number> {
    return this.prisma.issue.count({
      where: {
        userId,
      },
    });
  }

  countHighlightsGiven(userId: string): Promise<number> {
    return this.prisma.highlight.count({
      where: {
        userId,
      },
    });
  }

  countHighlightsReceived(userId: string): Promise<number> {
    return this.prisma.highlight.count({
      where: {
        issue: {
          userId,
        },
      },
    });
  }

  countUsers(where?: Prisma.UserWhereInput): Promise<number> {
    return this.prisma.user.count({ where: where ?? undefined });
  }
}
